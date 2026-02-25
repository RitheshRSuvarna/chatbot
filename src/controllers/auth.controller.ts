import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import users from "../models/user";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await users.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const User = await users.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    // _id: User._id,
    // name: User.name,
    // email: User.email,
    token: generateToken(User._id.toString()),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const User = await users.findOne({ email });

  if (User && (await bcrypt.compare(password, User.password))) {
     res.json({message:"Login Successful"
    //   // _id: User._id,
    //   // name: User.name,
    //   // email: User.email,
    //   // token: generateToken(User._id.toString()),
    });
    
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};