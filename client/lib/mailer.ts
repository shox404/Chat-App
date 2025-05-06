import { Resend } from 'resend';

const resend = new Resend("re_W9BAxv2h_CE3PFj6NHo8aJW3NTqrJajtb");

export const sendVerificationCode = async (to: string, code: string) => {
  try {
    const data = await resend.emails.send({
      from: 'Your App refounderme@gmail.com',
      to: to,
      subject: 'Your Verification Code',
      html: `<h1>Your code is: <strong>${code}</strong></h1>`,
    });

    console.log("Resend result:", data);
    return true;
  } catch (error) {
    console.error("Resend failed:", error);
    return false;
  }
};
