import csv from "csv-parser";
import {Readable} from "stream";
import type {CreateQuestionDTO} from "../ats/ats-questions/ats-question.interface";
import {QuestionSchema} from "../ats/ats-questions/ats-question.schema";
import Question from "../ats/ats-questions/ats-question.model";
import logger from "./logger";
import path from "path";
import xlsx from "xlsx";

export async function parseAssessmentFile(
  file: Buffer,
  filename: string
): Promise<CreateQuestionDTO[]> {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".csv") {
    return parseCSVFile(file);
  } else if (ext === ".xlsx" || ext === ".xls") {
    return parseExcel(file);
  } else {
    throw new Error("Unsupported file format. Please upload CSV or Excel.");
  }
}

export async function parseCSVFile(file: Buffer): Promise<CreateQuestionDTO[]> {
  return new Promise((resolve, reject) => {
    const rawResults: CreateQuestionDTO[] = [];

    const decodedText = file.toString("utf-8");
    const normalizedText = decodedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
    const stream = Readable.from([normalizedText]);

    logger.info("✅ Starting CSV parsing...");

    stream
      .pipe(csv())
      .on("data", (row) => {
        try {
          if (!row.question || !row.category || !row.type || !row.answer)
            return;

          const parsed = QuestionSchema.create.parse({
            category: row.category?.trim(),
            type: row.type?.trim() as "single" | "multiple" | "text",
            question: row.question?.trim(),
            source: row.source
              ? {
                  secure_url: row.source?.trim(),
                  public_id: "",
                }
              : undefined,
            options:
              row.type?.trim() === "text"
                ? undefined
                : {
                    a: row.option_a?.trim(),
                    b: row.option_b?.trim(),
                    c: row.option_c?.trim(),
                    d: row.option_d?.trim(),
                    e: row.option_e?.trim(),
                  },
            answer: row.answer?.trim(),
          });

          rawResults.push(parsed);
        } catch (err) {
          logger.error("❌ Validation error in row:", row, err);
        }
      })
      .on("end", async () => {
        logger.info("✅ Finished reading CSV file");

        // 🧠 Deduplicate against DB
        const questionsInCSV = rawResults.map((q) => q.question);
        const existing = await Question.find({
          question: {$in: questionsInCSV},
        }).lean();

        const existingSet = new Set(existing.map((q) => q.question));
        const filteredResults = rawResults.filter(
          (q) => !existingSet.has(q.question)
        );

        logger.info(
          `✅ Deduplicated. ${filteredResults.length} new questions to insert.`
        );
        resolve(filteredResults);
      })
      .on("error", (error) => {
        logger.error("❌ CSV parsing error:", error);
        reject(error);
      });
  });
}

export function parseExcel(file: Buffer): CreateQuestionDTO[] {
  const workbook = xlsx.read(file, {type: "buffer"});

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error("No sheet found in uploaded Excel file");

  const sheet = workbook.Sheets[firstSheetName];
  if (!sheet) throw new Error("Invalid sheet data in Excel file");

  const rows = xlsx.utils.sheet_to_json<Record<string, any>>(sheet);
  const parsedQuestions: CreateQuestionDTO[] = [];

  const seenKeys = new Set<string>(); // Used for duplicate prevention

  for (const row of rows) {
    try {
      const questionText = String(row["question"] || "").trim();
      const categoryText = String(row["category"] || "").trim();
      const typeText = String(row["type"] || "")
        .trim()
        .toLowerCase();

      const uniqueKey = `${questionText}|${categoryText}|${typeText}`;
      if (seenKeys.has(uniqueKey)) {
        logger.info("⚠️ Duplicate skipped:", uniqueKey);
        continue;
      }

      const parsed = QuestionSchema.create.parse({
        category: categoryText,
        type: typeText as "single" | "multiple" | "text",
        question: questionText,
        source: row["source"]
          ? {secure_url: String(row["source"]).trim(), public_id: ""}
          : undefined,
        options:
          typeText === "text"
            ? undefined
            : {
                a: String(row["option_a"] || "").trim(),
                b: String(row["option_b"] || "").trim(),
                c: String(row["option_c"] || "").trim(),
                d: String(row["option_d"] || "").trim(),
                e: String(row["option_e"] || "").trim(),
              },
        answer: String(row["answer"] || "").trim(),
      });

      seenKeys.add(uniqueKey);
      parsedQuestions.push(parsed);
    } catch (err) {
      logger.error("❌ Excel validation error in row:", row, err);
    }
  }

  logger.error(
    `✅ Deduplicated. ${parsedQuestions.length} new questions to insert.`
  );
  return parsedQuestions;
}
