// wj
// useAuthStore
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateResetCode,
  getExpirationTime,
  isCodeExpired,
} from "../lib/resetPasswordHelpers.js";
import { sendResetEmail } from "../lib/emailService.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidUsername = (name) => /^[a-zA-Z0-9_]{3,}$/.test(name);
const isStrongPassword = (password) =>
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //  Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidUsername(name)) {
      return res.status(400).json({
        message:
          "Username must be at least 3 characters and only contain letters, numbers, or underscores",
      });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, and a number",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error("Error in signup controller:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    // console.log(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, res);

    res.status(200).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    // res.cookie("jwt", "", { maxAge: 0 });
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, gender, profilePic } = req.body;
    const userId = req.user._id;

    const updateData = {};

    if (name) updateData.name = name;
    if (gender) updateData.gender = gender;

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" }); // Explicit 401 for no user
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const requestResetCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newCode = generateResetCode();
    const expiresAt = getExpirationTime();

    await User.findByIdAndUpdate(user._id, {
      $set: {
        "passwordReset.code": newCode,
        "passwordReset.expiresAt": expiresAt,
      },
      $push: {
        "passwordReset.previousCodes": user.passwordReset?.code || [],
      },
    });

    await sendResetEmail(email, newCode, expiresAt);

    res.json({
      success: true,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to process request",
    });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.passwordReset?.code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (isCodeExpired(user.passwordReset?.expiresAt)) {
      return res.status(400).json({ message: "Expired code" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const resetPassword = async (req, res) => {
//   try {
//     const { email, code, newPassword, newPasswordConfirm } = req.body;

//     if (!newPassword || !newPasswordConfirm) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (newPassword.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "New password must be at least 8 characters long" });
//     }

//     if (newPassword !== newPasswordConfirm) {
//       return res.status(400).json({ message: "Please confirm your password" });
//     }

//     const user = await User.findOne({
//       email,
//       "passwordReset.code": code,
//       "passwordReset.expiresAt": { $gt: new Date() },
//     });

//     const isOld = await bcrypt.compare(newPassword, user.password);
//     if (isOld) {
//       return res
//         .status(400)
//         .json({ message: "New password cannot be the same as old password" });
//     }

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired code" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt);

//     user.password = hashedNewPassword;
//     user.passwordReset = undefined;

//     await user.save();

//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword, newPasswordConfirm } = req.body;

    //  Validate fields
    if (!email || !code || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, and a number",
      });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //  Find user with matching reset code and not expired
    const user = await User.findOne({
      email,
      "passwordReset.code": code,
      "passwordReset.expiresAt": { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password",
      });
    }

    //Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    user.passwordReset = undefined;

    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
