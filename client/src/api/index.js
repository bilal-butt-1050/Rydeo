import api from "../utils/axios.js";

// -------- AUTH ROUTES --------
export const login = (loginID, password) =>
  api.post("/user/login", { loginID, password });

export const logout = () => api.post("/user/logout");

// -------- ADMIN ROUTES --------
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const createStudent = (studentData) =>
  api.post("/admin/create-student", studentData);
export const createDriver = (driverData) =>
  api.post("/admin/create-driver", driverData);

// -------- ROUTE MANAGEMENT --------
export const getAllRoutes = () => api.get("/admin/routes");
export const getRouteDetails = (id) => api.get(`/admin/routes/${id}`);
export const createRoute = (routeData) => api.post("/admin/routes", routeData);
export const updateRoute = (id, routeData) => 
  api.put(`/admin/routes/${id}`, routeData);
export const deleteRoute = (id) => api.delete(`/admin/routes/${id}`);

// -------- STUDENT ROUTES --------
export const getStudentProfile = () => api.get("/student/profile");

// -------- DRIVER ROUTES --------
export const getDriverProfile = () => api.get("/driver/profile");