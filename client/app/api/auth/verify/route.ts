import { NextResponse } from "next/server";
import {
  getOneDocByField,
  createDoc,
  deleteDocById,
} from "@/app/_firebase/utils";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and code required" },
      { status: 400 }
    );
  }

  const pending = await getOneDocByField(
    "pendingVerifications",
    "email",
    email
  );
  if (!pending) {
    return NextResponse.json(
      { error: "No pending verification found" },
      { status: 404 }
    );
  }

  if (pending.code !== code) {
    return NextResponse.json(
      { error: "Invalid verification code" },
      { status: 401 }
    );
  }

  const { password } = pending;

  const newUser = {
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  await createDoc("users", newUser);
  await deleteDocById("pendingVerifications", pending.id);

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10d" });

  const response = NextResponse.json({
    message: "User verified and created",
    token,
  });
  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
