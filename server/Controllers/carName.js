import CarName from '../Models/CarName.js';
import asyncHandler from 'express-async-handler';

export const getCarNames = asyncHandler(async (req, res) => {
  const names = await CarName.find().sort({ name: 1 });
  res.json(names);
});

export const createCarName = asyncHandler(async (req, res) => {
  const name = await CarName.create(req.body);
  res.status(201).json(name);
});

export const deleteCarName = asyncHandler(async (req, res) => {
  await CarName.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});