import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const generateToken = (data: object) => {
  return jwt.sign(data, SECRET, { expiresIn: "10d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {}
};
