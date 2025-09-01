import mongoose from "mongoose";
import Applicant from "../../ats/applicant/applicant.model";
import {hashPassword} from "../validationUtils";

const db = mongoose.connect("mongodb://localhost:27017/", {
  dbName: "erp",
});

/**
 *  firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string | undefined;
    state?: string | undefined;
    lga?: string | undefined;
    age?: number | undefined;
    gender?: "male" | "female" | "other" | undefined;
    address?: string | undefined;
    nin?: string | undefined;
    bvn?: string | undefined;
 */

async function seedApplicant() {
  try {
    await db;

    const hashedPassword = await hashPassword("pass12345");
    const applicant = await Applicant.create({
      firstName: "Bodunrin",
      lastName: "David-Applicant",
      email: "bodunrindavidbond+11@gmail.com",
      gender: "male",
      password: hashedPassword,
      isVerified: true,
    });

    console.log("applicant", applicant);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding applicant", error);
    process.exit(1);
  }
}

seedApplicant();
