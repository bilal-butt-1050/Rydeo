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

export const createRoute = (routeData) =>
  api.post("/admin/create-route", routeData);

export const createBus = (busData) =>
  api.post("/admin/create-bus", busData);

export const createStop = (stopData) =>
  api.post("/admin/create-stop", stopData);

export const getAllRoutes = () => api.get("/admin/routes");

export const getAllBuses = () => api.get("/admin/buses");

export const getAllStops = () => api.get("/admin/stops");

export const getStopsByRoute = (routeId) => api.get(`/admin/stops/${routeId}`);

export const getAllDriverLocations = () => api.get("/admin/driver-locations");

// -------- STUDENT ROUTES --------
export const getStudentProfile = () => api.get("/student/profile");

export const getBusLocation = () => api.get("/student/bus-location");

export const getStudentRouteStops = () => api.get("/student/route-stops");

// -------- DRIVER ROUTES --------
export const getDriverProfile = () => api.get("/driver/profile");

export const toggleLocation = (isActive) => 
  api.post("/driver/toggle-location", { isActive });

export const updateLocation = (latitude, longitude) =>
  api.post("/driver/update-location", { latitude, longitude });

export const getDriverRouteStops = () => api.get("/driver/route-stops");