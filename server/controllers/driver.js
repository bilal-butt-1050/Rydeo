export const getDriverProfile = (req, res) => {
  res.json({ message: `Welcome driver ${req.user.name}` });
};
