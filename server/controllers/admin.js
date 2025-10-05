import { Student, Driver } from "../models/user.js";
import Bus from "../models/bus.js";
import Route from "../models/route.js";
import Stop from "../models/stop.js";

// Create student
export const createStudent = async (req, res) => {
  const { name, loginID, password, phone, defaultStop, bus, route } = req.body;

  try {
    const student = new Student({ 
      name, 
      loginID, 
      password, 
      phone, 
      defaultStop, 
      bus, 
      route 
    });
    await student.save();
    res.status(201).json({ message: "Student created", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create driver
export const createDriver = async (req, res) => {
  const { name, loginID, password, phone, bus, route } = req.body;

  try {
    const driver = new Driver({ name, loginID, password, phone, bus, route });
    await driver.save();
    
    // Update bus with driver reference
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
  const { routeName, startPoint, endPoint } = req.body;

  try {
    const route = new Route({ routeName, startPoint, endPoint });
    await route.save();
    res.status(201).json({ message: "Route created", route });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create bus
export const createBus = async (req, res) => {
  const { busNumber, route, capacity } = req.body;

  try {
    const bus = new Bus({ busNumber, route, capacity });
    await bus.save();
    res.status(201).json({ message: "Bus created", bus });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create stop
export const createStop = async (req, res) => {
  const { stopName, latitude, longitude, route } = req.body;

  try {
    const stop = new Stop({ stopName, latitude, longitude, route });
    await stop.save();
    res.status(201).json({ message: "Stop created", stop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all routes
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json({ routes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all buses
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate('route', 'routeName')
      .populate('driver', 'name phone');
    res.json({ buses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stops
export const getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find().populate('route', 'routeName');
    res.json({ stops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get stops by route
export const getStopsByRoute = async (req, res) => {
  const { routeId } = req.params;
  
  try {
    const stops = await Stop.find({ route: routeId });
    res.json({ stops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all driver locations
export const getAllDriverLocations = async (req, res) => {
  try {
    const drivers = await Driver.find({ isLocationActive: true })
      .select('name phone currentLocation bus route')
      .populate('bus', 'busNumber')
      .populate('route', 'routeName');
    
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments();
    const driverCount = await Driver.countDocuments();
    const busCount = await Bus.countDocuments();
    const routeCount = await Route.countDocuments();
    
    res.json({ 
      message: `Welcome admin ${req.user.name}`,
      stats: {
        students: studentCount,
        drivers: driverCount,
        buses: busCount,
        routes: routeCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};