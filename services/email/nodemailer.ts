// utils/sendMail.ts (or .js)

import nodemailer from 'nodemailer';
import { SENDER_EMAIL } from '@/app/config/envs';
// Define the shape of the data that Better-Auth will pass to your function
interface VerificationData {
  email: string;
  name?: string;
  url?: string; 
  otp?: string;
}

// TODO : fix the name of the app and all constant values 

export async function sendMailLink({ email, name, url }: VerificationData) {
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

  const senderEmail = SENDER_EMAIL;

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



export async function sendMailResetLink({ email, name, url }: VerificationData) {
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

  const senderEmail = SENDER_EMAIL;

  if (!senderEmail) {
    throw new Error('FROM_EMAIL environment variable is not set.');
  }

  // 2. Define the email content
  const mailOptions = {
    from: `"Your App Name" <${senderEmail}>`, // sender address
    to: email, // list of receivers (the user's email)
    subject: 'Reset your password!', // Subject line
    text: `Click the link to reset your password: ${url}`, // plain text body
    html: `
      <html>
      <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #4CAF50;">Password Reset</h1>
          <p>Hello ${name},</p>
          <p>You’re receiving this email because we received a password reset request for your account.
Click the link below to reset your password.</p>
          <p style="margin: 20px 0;">
              <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  Reset Password
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



export async function sendMailOTP({ email, otp }: VerificationData) {
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

  const senderEmail = SENDER_EMAIL;

  if (!senderEmail) {
    throw new Error('FROM_EMAIL environment variable is not set.');
  }

 // Assume you have the following variables available:
// const name = "User Name"; // The user's name
// const email = "user@example.com"; // The user's email
// const otp = "123456"; // The generated OTP code
// const senderEmail = "no-reply@yourappname.com";

const mailOptions = {
  from: `"Your App Name" <${senderEmail}>`, // sender address
  to: email, // list of receivers (the user's email)
  subject: 'Your One-Time Verification Code (OTP)', // Subject line
  text: `Your One-Time Verification Code (OTP) is: ${otp}. This code is valid for 5 minutes.`, // plain text body
  html: `
    <html>
    <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">🔐 Verification Code</h1>
        <p>Hello,</p>
        <p>Please use the following One-Time Password (OTP) to complete your login or verification process:</p>

        <div style="text-align: center; margin: 30px 0; padding: 15px; border: 2px dashed #4CAF50; border-radius: 8px; background-color: #f9f9f9;">
            <p style="font-size: 28px; margin: 0; font-weight: bold; letter-spacing: 5px; color: #333;">
                ${otp}
            </p>
        </div>
        
        <p style="font-weight: bold;">This code is valid for 5 minutes and can only be used once.</p>
        <p>Do not share this code with anyone.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">
        <p style="font-size: 0.8em; color: #999;">If you didn't request this code, you can safely ignore this email.</p>
    </body>
    </html>
  `, // html body with the OTP code
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