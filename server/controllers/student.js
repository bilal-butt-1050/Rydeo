export const getStudentProfile = (req, res) => {
  res.json({ message: `Welcome student ${req.user.name}` });
};
