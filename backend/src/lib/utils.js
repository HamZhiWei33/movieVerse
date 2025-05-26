import jwt from "jsonwebtoken";
// export const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
//   res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, //change to milliseconds
//     httpOnly: true, //prevent XSS attacks cross-site scripting attacks
//     sameSite: "strict", //prevents CSRF attacks cross-site request forgery attacks
//     secure: process.env.NODE_ENV !== "development", //if in production, use secure cookies
//   });
//   return token;
// };
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", // safer for dev, more permissive
    secure: isProduction, // HTTPS only in production
  });

  return token;
};
