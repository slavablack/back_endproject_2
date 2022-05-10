// const dotenv = require("dotenv");
// const express = require("express");
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// import axios from "axios";
// import { localConnection, remoteConnection } from "./config.js";

// main().catch((err) => console.log(err));
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

const url = process.env.DB_REMOTECONNECTION;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
});
const User = mongoose.model("User", userSchema);

const getUsers = async () => {
  return await User.find().exec();
};
//get Daten
app.get("/", async (req, res) => {
  try {
    const data = await getUsers();
    res.json(data);
  } catch (err) {
    res.json({ err: err.message });
  }
});
//create new user
app.post("/newUser", async (req, res) => {
  try {
    const newUser = new User({
      ...req.body,
    });
    const tempUser = await newUser.save();
    // console.log(newUser);
    res.json(newUser);
  } catch (err) {
    res.json({ err: err.message });
  }
});

//update user
app.patch("/:id", async (req, res) => {
  try {
    console.log(req.body.firstName);
    const update = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
    }).exec();
    res.json(update);
  } catch (err) {
    res.json({ err: err.message });
  }
});
//Delete user

app.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    const data = await User.find();
    res.json(data);
  } catch (err) {
    res.json({ err: err.message });
  }
});

mongoose.connect(url).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
