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
      subject: `New Message from ${name}`,
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
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #121212; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); margin-top: 20px; margin-bottom: 20px; border: 1px solid #2ed573;">
    <!-- Header -->
    <div style="background-color: #1e272e; padding: 20px; text-align: center; border-bottom: 2px solid #2ed573;">
      <h1 style="color: #2ed573; margin: 0; font-size: 24px; font-weight: 600;">New Message from Your Portfolio</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px; background-color: #1a1b26;">
      <div style="background-color: #0f0f0f; border-radius: 8px; padding: 25px; border-left: 4px solid #2ed573;">
        <p style="margin-bottom: 20px; color: #2ed573; font-size: 16px;">You've received a new message from your portfolio contact form:</p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #2ed57333; color: #999; width: 100px;">From:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #2ed57333; color: #fff; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #2ed57333; color: #999;">Email:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #2ed57333; color: #fff; font-weight: 500;"><a href="mailto:${email}" style="color: #2ed573; text-decoration: none;">${email}</a></td>
          </tr>
        </table>

        <div style="margin-top: 25px;">
          <h3 style="color: #2ed573; font-size: 18px; margin-bottom: 15px; font-weight: 500;">Message:</h3>
          <div style="background-color: #1e272e; border-radius: 8px; padding: 20px; color: #eee; line-height: 1.6; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f0f0f; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #2ed57333;">
      <p style="margin: 0;">© ${new Date().getFullYear()} Arafat Portfolio. All rights reserved.</p>
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
