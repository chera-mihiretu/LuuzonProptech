// utils/sendMail.ts (or .js)

import nodemailer from 'nodemailer';

// Define the shape of the data that Better-Auth will pass to your function
interface VerificationData {
  email: string;
  name: string, 
  url: string; 
}


export async function sendMail({ email, name, url }: VerificationData) {
  // 1. Create a Nodemailer transporter using your environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465, // Use true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const senderEmail = process.env.FROM_EMAIL;

  if (!senderEmail) {
    throw new Error('FROM_EMAIL environment variable is not set.');
  }

  // 2. Define the email content
  const mailOptions = {
    from: `"Your App Name" <${senderEmail}>`, // sender address
    to: email, // list of receivers (the user's email)
    subject: 'Verify Your Email Address', // Subject line
    text: `Click the link to verify your email: ${url}`, // plain text body
    html: `
      <html>
      <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #4CAF50;">Email Verification</h1>
          <p>Hello ${name},</p>
          <p>Thanks for signing up! Please click the link below to verify your email address and activate your account:</p>
          <p style="margin: 20px 0;">
              <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Verify Email Address
              </a>
          </p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #999;">If you didn't request this, you can safely ignore this email.</p>
      </body>
      </html>
    `, // html body with the verification URL
  };

  // 3. Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification Email sent: %s', info.messageId);
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
}