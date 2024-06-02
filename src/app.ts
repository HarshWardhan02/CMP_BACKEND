import express from "express";
import * as DbConnectUtil from './utils/dbconnection.utils';
import { logger } from "./utils/log.utils";
import bodyParser from 'body-parser';
import  User from '../src/models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

// Signup route without password hashing
app.post('/signup',async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    // const existingUser =  User.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'User already exists' });
    // }

    // Create a new user
    const newUser = new User({
      name,
      email,
      password, // No password hashing
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

DbConnectUtil.connectDatabase();

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
