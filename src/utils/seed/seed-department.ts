import mongoose from "mongoose";
import Department from "../../modules/department/department.model";

const db = mongoose.connect("mongodb://localhost:27017/", {dbName: "erp"});

async function seedDepartment() {
  try {
    await db;
    const department = await Department.create({
      name: "Test Department",
      description: "This is a test department.",
      label: "TD",
    });

    console.log("Department seeded:", department);
    process.exit(0);
  } catch (error) {
    console.log("Error seeding department:", error);
    process.exit(1);
  }
}

seedDepartment();
