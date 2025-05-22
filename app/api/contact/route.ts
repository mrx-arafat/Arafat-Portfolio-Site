import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { name, email, message } = body;

    // Validate the input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "your-email@gmail.com",
        pass: process.env.SMTP_PASSWORD || "your-password",
      },
    });

    // Email content
    const mailOptions = {
      from:
        process.env.SMTP_FROM || "Your Portfolio Site <your-email@gmail.com>",
      to: process.env.CONTACT_EMAIL || "e4rafat@gmail.com",
      replyTo: email,
      subject: `✉️ ${name} sent you a message via your portfolio`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New message from ${name}</title>
</head>
<!-- Preview text -->
<div style="display: none; max-height: 0px; overflow: hidden;">
  ${name} sent: "${message.substring(0, 100).replace(/\r?\n|\r/g, " ")}${
        message.length > 100 ? "..." : ""
      }" - Reply to this email to respond directly.
</div>
<!-- End preview text -->
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f9f9f9; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); margin-top: 20px; margin-bottom: 20px; border: 1px solid #2ed573;">
    <!-- Header -->
    <div style="background-color: #1e272e; padding: 20px; text-align: center; border-bottom: 2px solid #2ed573;">
      <h1 style="color: #2ed573; margin: 0; font-size: 24px; font-weight: 600;">Message from ${name}</h1>
    </div>

    <!-- Content -->
    <div style="padding: 25px; background-color: #1a1b26;">
      <div style="background-color: #0f0f0f; border-radius: 8px; padding: 20px; border-left: 4px solid #2ed573;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #2ed57333; color: #999; width: 80px;">From:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #2ed57333; color: #fff; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #2ed57333; color: #999;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #2ed57333; color: #fff; font-weight: 500;"><a href="mailto:${email}" style="color: #2ed573; text-decoration: none;">${email}</a></td>
          </tr>

        </table>

        <div style="margin-top: 20px;">
          <h3 style="color: #2ed573; font-size: 16px; margin-bottom: 10px; font-weight: 500;">Message:</h3>
          <div style="background-color: #1e272e; border-radius: 8px; padding: 15px; color: #eee; line-height: 1.5; white-space: pre-wrap;">${message}</div>
        </div>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <a href="mailto:${email}" style="display: inline-block; padding: 10px 20px; background-color: #2ed573; color: #0f0f0f; text-decoration: none; font-weight: bold; border-radius: 4px;">Reply to ${name}</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f0f0f; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #2ed57333;">
      <p style="margin: 0;">© ${new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
      ).getFullYear()} Arafat Portfolio Site. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
