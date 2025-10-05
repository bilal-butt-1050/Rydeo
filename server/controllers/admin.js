import { Student, Driver } from "../models/user.js";

// Create student
export const createStudent = async (req, res) => {
  const { name, loginID, password, defaultStop } = req.body;

  try {
    const student = new Student({ name, loginID, password, defaultStop });
    await student.save();
    res.status(201).json({ message: "Student created", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create driver
export const createDriver = async (req, res) => {
  const { name, loginID, password, phone, bus } = req.body;

  try {
    const driver = new Driver({ name, loginID, password, phone, bus });
    await driver.save();
    res.status(201).json({ message: "Driver created", driver });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Dashboard
export const getAdminDashboard = (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
};
