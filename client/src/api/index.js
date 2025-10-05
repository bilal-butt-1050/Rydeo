import api from "../utils/axios.js";

// -------- AUTH ROUTES --------
export const login = (loginID, password) =>
  api.post("/user/login", { loginID, password });

// -------- ADMIN ROUTES --------
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const createStudent = (studentData) =>
  api.post("/admin/create-student", studentData);
export const createDriver = (driverData) =>
  api.post("/admin/create-driver", driverData);

// -------- STUDENT ROUTES --------
export const getStudentProfile = () => api.get("/student/profile");

// -------- DRIVER ROUTES --------
export const getDriverProfile = () => api.get("/driver/profile");

export const logout = () => api.post("/user/logout");
