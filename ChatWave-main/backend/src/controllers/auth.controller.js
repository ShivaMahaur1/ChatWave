import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================
export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: "", // ✅ empty initially
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: "",
      });
    } catch (error) {
      console.log(error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ================= LOGIN =================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ================= LOGOUT =================
export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ success: true });
}

// ================= ONBOARD =================
export async function onboard(req, res) {
  const userId = req.user._id;

  try {
    const {
      fullName,
      bio,
      nativeLangauge,
      learningLangauge,
      location,
      profilePic, // ✅ Base64 image
    } = req.body;

    if (!fullName || !bio || !nativeLangauge || !learningLangauge || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLangauge,
        learningLangauge,
        location,
        profilePic, // ✅ SAVE BASE64
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (err) {
      console.log("Stream error:", err);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Onboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
