import { Student, Driver } from "../models/user.js";
import Bus from "../models/bus.js";
import Route from "../models/route.js";
import Stop from "../models/stop.js";

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

    // Update bus with driver reference if bus is provided
    if (bus) {
      await Bus.findByIdAndUpdate(bus, { driver: driver._id });
    }

    res.status(201).json({ message: "Driver created", driver });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create route
export const createRoute = async (req, res) => {
  const { routeNumber, routeName, startPoint, endPoint, startPointCoords, endPointCoords } = req.body;

  try {
    const route = new Route({ 
      routeNumber, 
      routeName, 
      startPoint, 
      endPoint, 
      startPointCoords, 
      endPointCoords 
    });
    await route.save();
    res.status(201).json({ message: "Route created", route });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create bus
export const createBus = async (req, res) => {
  const { busNumber, route, driver } = req.body;

  try {
    const bus = new Bus({ busNumber, route, driver });
    await bus.save();

    // Update driver with bus reference if driver is provided
    if (driver) {
      await Driver.findByIdAndUpdate(driver, { bus: bus._id });
    }

    res.status(201).json({ message: "Bus created", bus });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create stop
export const createStop = async (req, res) => {
  const { stopName, latitude, longitude, route, address } = req.body;

  try {
    const stop = new Stop({ stopName, latitude, longitude, route, address });
    await stop.save();
    res.status(201).json({ message: "Stop created", stop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all resources for dropdowns
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().select('_id routeNumber routeName');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('route', 'routeNumber routeName').populate('driver', 'name');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find().populate('route', 'routeNumber routeName');
    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('_id name phone').populate('bus', 'busNumber');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard
export const getAdminDashboard = (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
};