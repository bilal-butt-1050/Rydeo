import { Admin } from "../models/user.js";

const seedAdmin = async () => {
  const existingAdmin = await Admin.findOne({ role: "admin" });
  if (!existingAdmin) {
    const admin = new Admin({
      name: process.env.ADMIN_NAME || "Super Admin",
      loginID: process.env.ADMIN_LOGINID || "admin123",
      password: process.env.ADMIN_PASSWORD || "password123",
      permissions: ["manage_users"],
    });
    await admin.save();
    console.log("✅ Default admin created");
  } else {
    console.log("✅ Admin already exists");
  }
};

export default seedAdmin;
