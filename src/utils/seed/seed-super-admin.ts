import mongoose from "mongoose";
import { type IUser, UserRolesEnum } from "../../modules/user/user.interface";
import User from "../../modules/user/user.model";
import { hashPassword } from "../validationUtils";

const env = {
  ADMIN_EMAIL: Bun.env.ADMIN_EMAIL,
  ADMIN_FIRSTNAME: Bun.env.ADMIN_FIRSTNAME,
  ADMIN_LASTNAME: Bun.env.ADMIN_LASTNAME,
  ADMIN_PASSWORD: Bun.env.ADMIN_PASSWORD,
  MONGODB_URI: Bun.env.MONGODB_URI as string,
};

const seedSuperAdmin = async () => {
  const hashedPassword = await hashPassword(env.ADMIN_PASSWORD as string);
  const superAdmin: Partial<IUser> = {
    email: env.ADMIN_EMAIL,
    firstName: env.ADMIN_FIRSTNAME,
    lastName: env.ADMIN_LASTNAME,
    role: UserRolesEnum.SUPER_ADMIN,
    password: hashedPassword,
    isVerified: true,
  };

  await mongoose.connect(env.MONGODB_URI, { dbName: "erp" });
  await User.findOneAndDelete({ email: superAdmin.email });

  await User.create(superAdmin);

  console.log("Super Admin seeded.");
  process.exit(0);
};

seedSuperAdmin();
