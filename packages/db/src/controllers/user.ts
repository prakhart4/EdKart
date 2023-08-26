import { SignJWT } from "jose";
import { User } from "../models/user";
import mongoose from "mongoose";
import { dbConnect } from "../lib/dbConnect";

const secret = new TextEncoder().encode(process.env["SECRET"]!);

/**
 * Get user data along with purchased courses by user ID
 * @param userId user's _id in string form
 * @returns User object, excluding password field
 */
export const getUserById = async ({ userId }: { userId: string }) => {
  await dbConnect();

  console.log({ userId });
  //check if user exists
  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new Error("User not found");
  }

  //find user
  const result = await User.findOne({ _id: userId }).populate(
    "purchasedCourses"
  );

  const user = result?.toJSON();

  if (!user) {
    throw new Error("User not found");
  }

  // Remove the password field from the user object
  const { password, ...rest } = user;

  return rest;
};

/**
 * SignUp a user
 * @param name Name of the user, uniqueness is not required
 * @param email Email address of the user, should be unique per user
 * @param password Password of the user
 * @param isAdmin Whether the user is an admin or not
 * @returns user object and JWT token
 */
export const signupUser = async ({
  name,
  email,
  password,
  isAdmin = false,
}: {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}) => {
  await dbConnect();
  //check if all fields are provided
  if (!email || !password) {
    throw new Error("Please provide all required fields");
  }

  try {
    //hash the password
    const hashedPassword = password; //await bcrypt.hash(password, 10);

    //check if user exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      throw new Error("Email already exists");
    }

    //create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await user.save();

    //generate a JWT
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2d")
      .sign(secret);

    //return email and token
    return {
      user,
      token,
    };
  } catch (error: any) {
    //return error
    console.log(error);
    throw { message: "Registration failed", error: error };
    // res.status(500).json({ message: "Registration failed", error: error });
  }
};

/**
 * SignIn a user, both admin or not
 * @param email Email address of the user
 * @param password Password of the user
 * @param isAdmin Whether the user is an admin or not
 * @returns user object and JWT token
 */
export const signInUser = async ({
  email,
  password,
  isAdmin = false,
}: {
  email: string;
  password: string;
  isAdmin?: boolean;
}) => {
  await dbConnect();
  //check if all fields are provided
  if (!email || !password) {
    throw new Error("Please provide all required fields");
  }

  try {
    //find user
    const result = await User.findOne({
      email,
      isAdmin,
    });

    const user = result?.toJSON();

    //check if user exists
    if (!user) {
      throw new Error("User does not exist");
    }

    //check if password matches
    const isMatch = password; //await bcrypt.compare(password, user?.password ?? "");

    //return error if password does not match
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    //generate a JWT
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2d")
      .sign(secret);

    //remove password from response
    const { password: _, ...userRest } = user;

    //return token
    return { user: userRest, token };
  } catch (error: any) {
    //return error
    throw { message: error?.message ?? "SignIn failed", error: error };
  }
};
