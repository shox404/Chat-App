import { Resend } from "resend";

const resend = new Resend("re_W9BAxv2h_CE3PFj6NHo8aJW3NTqrJajtb");

const isBrowser = typeof window !== "undefined";
const isLocalhost = isBrowser && window.location.hostname === "localhost";

export const EMAIL = isLocalhost
  ? `onboarding@resend.dev`
  : "refounderme@gmail.com";

export const sendVerificationCode = async (to: string, code: string) => {
  try {
    const data = await resend.emails.send({
      from: EMAIL,
      to: to,
      subject: "Your Verification Code",
      html: `<h1>Your code is: <strong>${code}</strong></h1>`,
    });

    console.log("Resend result:", data);
    return true;
  } catch (error) {
    console.error("Resend failed:", error);
    return false;
  }
};
