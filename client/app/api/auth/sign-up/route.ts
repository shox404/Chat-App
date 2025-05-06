import { NextResponse } from "next/server";
import { getOneDocByField, createDoc } from "@/app/_firebase/utils";
import { sendVerificationCode } from "@/lib/mailer";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await getOneDocByField("users", "email", email);

    if (existingUser) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const success = await sendVerificationCode(email, code);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to send verification code" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createDoc("pendingVerifications", { email, code });
    await createDoc("users", { email, password: hashedPassword });

    return NextResponse.redirect(new URL("/verify", req.url));
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
