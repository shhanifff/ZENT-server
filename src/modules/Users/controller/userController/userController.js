import userModel from "../../models/userSchema/userSchema.js";
// import userSchema from "../models/userSchema.js";
import {
  comparedPassword,
  hashedPassword,
} from "../../../../../utils/bycrypt.js";
import { generateToken } from "../../../../../utils/jwt.js";

// =========================== Register ========================================
export const userRegister = async (req, res) => {
  console.log("body check", req.body);
  const { name, email, password } = req.body;

  if(!name || !email || !password){
    return res.status(404).json({success:false, message:"credentials not found"})
  }

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exist" });
  }

  const hashPassword = await hashedPassword(password);
  console.log("password check", hashPassword);

  const newUser = new userModel({
    name,
    email,
    password: hashPassword,
    cart: [],
  });

  console.log(newUser);
  await newUser.save();

  return res
    .status(201)
    .json({ message: "Register Successfully", data: newUser });
};

//============================== Login =========================================

export const loginHandle = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const existUser = await userModel.findOne({ email });

  if (!existUser) {
    return res.status(404).json({ success: false, message: "Please register" });
  }

  const passwordValidation = await comparedPassword(
    password,
    existUser.password
  );

  if (!passwordValidation) {
    return res
      .status(401)
      .json({ success: false, message: "Password doesn't match" });
  }

  const token = generateToken(existUser._id);
  console.log("token", token);
  // localStorage.setItem('token',token)

  res.status(200).json({
    success: true,
    message: "login successfully",
    data: existUser,
    token,
  });
};
