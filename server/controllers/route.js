import Route from "../models/route.js";
import Stop from "../models/stop.js";

// Get all routes with their stops
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("stops");
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single route with stops
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("stops");
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new route
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

    // If stops are provided, create them and link to route
    if (stops && stops.length > 0) {
      const createdStops = await Stop.insertMany(
        stops.map((stop) => ({
          ...stop,
          route: route._id,
        }))
      );

      // Update route with stop references
      route.stops = createdStops.map((stop) => stop._id);
      await route.save();
    }

    const populatedRoute = await Route.findById(route._id).populate("stops");
    res.status(201).json({
      message: "Route created successfully",
      route: populatedRoute,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update route
export const updateRoute = async (req, res) => {
  try {
    const { routeName, startPoint, endPoint, stops } = req.body;

    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Update basic route info
    if (routeName) route.routeName = routeName;
    if (startPoint) route.startPoint = startPoint;
    if (endPoint) route.endPoint = endPoint;

    // If stops are provided, update them
    if (stops) {
      // Delete old stops
      await Stop.deleteMany({ route: route._id });

      // Create new stops
      const createdStops = await Stop.insertMany(
        stops.map((stop) => ({
          ...stop,
          route: route._id,
        }))
      );

      route.stops = createdStops.map((stop) => stop._id);
    }

    await route.save();
    const updatedRoute = await Route.findById(route._id).populate("stops");

    res.json({
      message: "Route updated successfully",
      route: updatedRoute,
    });
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

    // Delete all stops associated with this route
    await Stop.deleteMany({ route: route._id });

    // Delete the route
    await route.deleteOne();

    res.json({ message: "Route and its stops deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};