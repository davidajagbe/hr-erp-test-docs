import mongoose from "mongoose";
import Client from "../../modules/client/client.model";
import User from "../../modules/user/user.model";
import {hashPassword} from "../validationUtils";

const db = mongoose.connect("mongodb://localhost:27017/", {
  dbName: "erp",
});

async function seed() {
  try {
    await db;

    // Create the client company
    const client = await Client.create({
      companyName: "GTB",
      companyType: "PRIVATE LIMITED",
      industry: "Financial",
      companySize: "10000",
      companyAddress: "2, Ozumba Mbadiwe way Alausa, Ikeja Lagos",
      companyEmail: "sage@gmail.com",
      companyPhoneNumber: "08104648031",
      companyWebsite: "www.gtb.com",
      cityOfOperation: "Lagos",
      rcNumber: "10100212",
    });

    const hashedPassword = await hashPassword("pass1234");

    // Create the admin user for the client
    const adminUser = await User.create({
      firstName: "James",
      lastName: "Bodunrin",
      email: "bodunrindavidbond+1@gmail.com",
      role: "CLIENT_ADMIN", // or whatever your system uses for client admins
      position: "Engineer",
      password: hashedPassword,
      isVerified: true,
      isActive: true,
      clientId: client._id, // link user to client if applicable
    });

    console.log("Client and admin user seeded:", {
      client,
      adminUser,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding client:", error);
    process.exit(1);
  }
}

seed();
