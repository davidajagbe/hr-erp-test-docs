import mongoose from "mongoose";
import User from "../../modules/user/user.model";
import {hashPassword} from "../validationUtils";

const db = mongoose.connect(
  "mongodb+srv://bctdevs:1VOGOXP3KSZOjGZw@cluster0.et83tbm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {dbName: "erp"}
);
// mongodb://localhost:27017/

async function seed() {
  try {
    await db;
    const hashedPassword = await hashPassword("pass12345");
    const staff = await User.create({
      firstName: "Kenechukwu",
      lastName: "Admin-rs-1",
      email: "kenechukwuokoh30+3@gmail.com",
      department: "689f13525ecdbfe4953cdb64",
      position: "test_admin", // test_admin
      role: "ADMIN", // ADMIN or STAFF
      password: hashedPassword,
      isVerified: true,
      isActive: true,
    });

    console.log("Staff seeded:", staff);
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

seed();
