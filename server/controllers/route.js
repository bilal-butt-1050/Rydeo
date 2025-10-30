import Route from "../models/route.js";
import Stop from "../models/stop.js";
import { Student, Driver } from "../models/user.js";
import Bus from "../models/bus.js";

// Get all routes
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('stops');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single route with detailed information
export const getRouteDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const route = await Route.findById(id).populate('stops');
    
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Find bus assigned to this route
    const bus = await Bus.findOne({ route: id }).populate('driver');
    
    // Find students using stops on this route
    const stopIds = route.stops.map(stop => stop._id);
    const students = await Student.find({ defaultStop: { $in: stopIds } })
      .populate('defaultStop');

    res.json({
      route,
      bus,
      driver: bus?.driver || null,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new route with stops
export const createRoute = async (req, res) => {
  const { routeName, startPoint, endPoint, stops } = req.body;

  try {
    // Create the route first
    const route = new Route({
      routeName,
      startPoint,
      endPoint,
    });
    await route.save();

    // Create stops if provided
    if (stops && stops.length > 0) {
      const createdStops = await Promise.all(
        stops.map(async (stop) => {
          const newStop = new Stop({
            ...stop,
            route: route._id,
          });
          return await newStop.save();
        })
      );
      
      // Update route with stop references
      route.stops = createdStops.map(stop => stop._id);
      await route.save();
    }

    const populatedRoute = await Route.findById(route._id).populate('stops');
    res.status(201).json({ 
      message: "Route created successfully", 
      route: populatedRoute 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update route
export const updateRoute = async (req, res) => {
  const { id } = req.params;
  const { routeName, startPoint, endPoint, stops } = req.body;

  try {
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Update basic route info
    route.routeName = routeName || route.routeName;
    route.startPoint = startPoint || route.startPoint;
    route.endPoint = endPoint || route.endPoint;

    // Handle stops update if provided
    if (stops) {
      // Delete existing stops
      await Stop.deleteMany({ route: id });
      
      // Create new stops
      if (stops.length > 0) {
        const createdStops = await Promise.all(
          stops.map(async (stop) => {
            const newStop = new Stop({
              ...stop,
              route: id,
            });
            return await newStop.save();
          })
        );
        route.stops = createdStops.map(stop => stop._id);
      } else {
        route.stops = [];
      }
    }

    await route.save();
    const populatedRoute = await Route.findById(id).populate('stops');
    
    res.json({ 
      message: "Route updated successfully", 
      route: populatedRoute 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete route
export const deleteRoute = async (req, res) => {
  const { id } = req.params;

  try {
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Delete all stops associated with this route
    await Stop.deleteMany({ route: id });
    
    // Delete the route
    await route.deleteOne();
    
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};