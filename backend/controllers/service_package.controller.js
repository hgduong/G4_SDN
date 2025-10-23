// File: backend/controllers/service_package.controller.js
const ServicePackage = require("../models/service_package.model");

//  GET all service packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await ServicePackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service packages", error });
  }
};

//  GET single package by ID
exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await ServicePackage.findById(id);
    if (!pkg) return res.status(404).json({ message: "Service package not found" });
    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving service package", error });
  }
};

//  POST - create new service package
exports.createPackage = async (req, res) => {
  try {
    const newPackage = new ServicePackage(req.body);
    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Failed to create service package", error });
  }
};


exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ServicePackage.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Service package not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update service package", error });
  }
};


exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServicePackage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Service package not found" });
    res.status(200).json({ message: "Service package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service package", error });
  }
};
