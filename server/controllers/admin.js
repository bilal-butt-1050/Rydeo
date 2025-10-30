import { Student, Driver } from "../models/user.js";
import Route from "../models/route.js";
import Stop from "../models/stop.js";

// Create student
export const createStudent = async (req, res) => {
  const { name, loginID, password, defaultStop, route } = req.body;

  try {
    // Verify route exists
    if (route) {
      const routeExists = await Route.findById(route);
      if (!routeExists) {
        return res.status(400).json({ message: "Route not found" });
      }
    }

    // Verify stop exists if provided
    if (defaultStop) {
      const stopExists = await Stop.findById(defaultStop);
      if (!stopExists) {
        return res.status(400).json({ message: "Stop not found" });
      }
    }

    const student = new Student({ name, loginID, password, defaultStop, route });
    await student.save();
    res.status(201).json({ message: "Student created", student });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create driver
export const createDriver = async (req, res) => {
  const { name, loginID, password, phone, route } = req.body;

  try {
    // Verify route exists
    if (route) {
      const routeExists = await Route.findById(route);
      if (!routeExists) {
        return res.status(400).json({ message: "Route not found" });
      }

      // Check if route already has a driver
      const existingDriver = await Driver.findOne({ route });
      if (existingDriver) {
        return res.status(400).json({ 
          message: "This route already has a driver assigned" 
        });
      }
    }

    const driver = new Driver({ name, loginID, password, phone, route });
    await driver.save();

    // Update route with driver reference
    if (route) {
      await Route.findByIdAndUpdate(route, { driver: driver._id });
    }

    res.status(201).json({ message: "Driver created", driver });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create route
export const createRoute = async (req, res) => {
  const { routeName, busNumber, startPoint, endPoint } = req.body;

  try {
    const route = new Route({ routeName, busNumber, startPoint, endPoint });
    await route.save();
    res.status(201).json({ message: "Route created", route });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all routes with students and driver
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('driver', 'name loginID phone');
    
    // Get students for each route
    const routesWithDetails = await Promise.all(
      routes.map(async (route) => {
        const students = await Student.find({ route: route._id })
          .populate('defaultStop', 'stopName')
          .select('name loginID defaultStop');
        
        return {
          ...route.toObject(),
          students,
        };
      })
    );

    res.json(routesWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single route with full details
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('driver', 'name loginID phone');
    
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const students = await Student.find({ route: route._id })
      .populate('defaultStop', 'stopName latitude longitude')
      .select('name loginID defaultStop');

    res.json({
      ...route.toObject(),
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update route
export const updateRoute = async (req, res) => {
  const { routeName, busNumber, startPoint, endPoint } = req.body;

  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Update fields
    if (routeName) route.routeName = routeName;
    if (busNumber) route.busNumber = busNumber;
    if (startPoint) route.startPoint = startPoint;
    if (endPoint) route.endPoint = endPoint;

    await route.save();
    res.json({ message: "Route updated", route });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete route
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Check if route has students or driver assigned
    const studentsCount = await Student.countDocuments({ route: route._id });
    const driver = await Driver.findOne({ route: route._id });

    if (studentsCount > 0 || driver) {
      return res.status(400).json({ 
        message: "Cannot delete route with assigned students or driver. Please reassign them first." 
      });
    }

    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard
export const getAdminDashboard = (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
};