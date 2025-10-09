import { Student, Driver } from "../models/user.js";
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
    res.status(201).json({ message: "Driver created", driver });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create route with stops
export const createRoute = async (req, res) => {
  const { routeName, startPoint, endPoint, stops } = req.body;

  try {
    // First, create the route
    const route = new Route({
      routeName,
      startPoint,
      endPoint,
    });

    await route.save();

    // Then create all stops associated with this route
    if (stops && stops.length > 0) {
      const stopPromises = stops.map((stop) => {
        const newStop = new Stop({
          stopName: stop.stopName,
          latitude: parseFloat(stop.latitude),
          longitude: parseFloat(stop.longitude),
          route: route._id,
        });
        return newStop.save();
      });

      await Promise.all(stopPromises);
    }

    res.status(201).json({
      message: "Route created successfully",
      route: {
        _id: route._id,
        routeName: route.routeName,
        startPoint: route.startPoint,
        endPoint: route.endPoint,
        stopCount: stops.length,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Dashboard
export const getAdminDashboard = (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
};