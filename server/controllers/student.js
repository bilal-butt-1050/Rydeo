import { Student, Driver } from "../models/user.js";
import Stop from "../models/stop.js";

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('-password')
      .populate('bus', 'busNumber')
      .populate('route', 'routeName startPoint endPoint')
      .populate('defaultStop', 'stopName latitude longitude');
    
    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusLocation = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    
    if (!student.bus) {
      return res.status(404).json({ message: "No bus assigned" });
    }
    
    const driver = await Driver.findOne({ bus: student.bus })
      .select('name phone currentLocation isLocationActive')
      .populate('bus', 'busNumber');
    
    if (!driver) {
      return res.status(404).json({ message: "Driver not found for this bus" });
    }
    
    if (!driver.isLocationActive) {
      return res.json({ 
        message: "Bus location tracking is currently inactive",
        isActive: false 
      });
    }
    
    res.json({ 
      driver: {
        name: driver.name,
        phone: driver.phone,
        bus: driver.bus
      },
      location: driver.currentLocation,
      isActive: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRouteStops = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id);
    
    if (!student.route) {
      return res.status(404).json({ message: "No route assigned" });
    }
    
    const stops = await Stop.find({ route: student.route })
      .sort({ stopName: 1 });
    
    res.json({ stops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};