import mongoose from "mongoose";
import Campaign from "../../modules/campaign/campaign.model";

const db = mongoose.connect("mongodb://localhost:27017/", {
  dbName: "erp",
});

async function seed() {
  try {
    await db;

    const campaign = await Campaign.create({
      serviceType: "RECRUITMENT AND SELECTION",
      title: "Banking Staff Needed",
      description: "We require banking staff for daily farming duties.",
      priorityLevel: "HIGH",
      jobRole: "Banker",
      numberOfStaff: 5,
      jobRequirements: "Must have experience in professional farming.",
      employmentType: "PART TIME",
      startDate: new Date("2025-08-01T09:00:00Z"),
      endDate: new Date("2025-12-31T17:00:00Z"),
      workSchedule: "OFFICE HOURS",
      resumptionTime: "09:00 AM",
      closingTime: "05:00 PM",
      workDays: "Monday to Friday",
      modeOfWork: "ON-SITE",
      workSiteAddress: "123 Main Street",
      city: "Lagos",
      languageRequired: "English",
      genderPreference: "MALE",
      specialNote: "Must wear uniform provided by the company.",
      referralCode: "USAU82182",
    });

    console.log("Campaign seeded:", campaign);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding campaign:", error);
    process.exit(1);
  }
}

seed();
