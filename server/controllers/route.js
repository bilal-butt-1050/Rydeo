import Route from "../models/route.js";
import Stop from "../models/stop.js";

// Create a new route with stops
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
          latitude: stop.latitude,
          longitude: stop.longitude,
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

// Get all routes
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single route with its stops
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    const stops = await Stop.find({ route: route._id });

    res.json({
      route,
      stops,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a route
export const updateRoute = async (req, res) => {
  const { routeName, startPoint, endPoint } = req.body;

  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.routeName = routeName || route.routeName;
    route.startPoint = startPoint || route.startPoint;
    route.endPoint = endPoint || route.endPoint;

    await route.save();

    res.json({ message: "Route updated successfully", route });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a route and its associated stops
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Delete all stops associated with this route
    await Stop.deleteMany({ route: route._id });

    // Delete the route
    await route.deleteOne();

    res.json({ message: "Route and associated stops deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};