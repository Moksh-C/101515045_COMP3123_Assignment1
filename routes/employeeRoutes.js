
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");


router.post("/employees", async (req, res) => {
  try {
    const { first_name, last_name, email, gender, salary } = req.body;
    const employee = new Employee({ first_name, last_name, email, gender, salary });
    await employee.save();
    res.status(201).json({ message: "Employee created successfully", employee });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/employees/:eid", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/employees/:eid", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.eid, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/employees/:eid", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.eid);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
