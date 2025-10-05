import { Driver } from "../models/user.js";
import Stop from "../models/stop.js";
import LocationLog from "../models/locationlog.js";

export const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user._id)
      .select('-password')
      .populate('bus', 'busNumber')
      .populate('route', 'routeName startPoint endPoint');
    
    res.json({ driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLocation = async (req, res) => {
  const { isActive } = req.body;
  
  try {
    const driver = await Driver.findById(req.user._id);
    driver.isLocationActive = isActive;
    
    if (!isActive) {
      driver.currentLocation = {
        latitude: null,
        longitude: null,
        lastUpdated: null
      };
    }
    
    await driver.save();
    res.json({ 
      message: isActive ? "Location tracking enabled" : "Location tracking disabled",
      isLocationActive: driver.isLocationActive 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  
  try {
    const driver = await Driver.findById(req.user._id);
    
    if (!driver.isLocationActive) {
      return res.status(400).json({ message: "Location tracking is not enabled" });
    }
    
    driver.currentLocation = {
      latitude,
      longitude,
      lastUpdated: new Date()
    };
    
    await driver.save();
    
    // Log location
    const locationLog = new LocationLog({
      bus: driver.bus,
      latitude,
      longitude
    });
    await locationLog.save();
    
    res.json({ message: "Location updated", currentLocation: driver.currentLocation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRouteStops = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user._id);
    
    if (!driver.route) {
      return res.status(404).json({ message: "No route assigned" });
    }
    
    const stops = await Stop.find({ route: driver.route })
      .sort({ stopName: 1 });
    
    res.json({ stops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};