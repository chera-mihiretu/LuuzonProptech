const MONGODB_URI : string = process.env.MONGODB_URI || "";
const BETTER_AUTH_URL : string = process.env.BETTER_AUTH_URL || "";
const RESEND_API_KEY : string = process.env.RESEND_API_KEY || "";
const OUR_DOMAIN_EMAIL : string = process.env.OUR_DOMAIN_EMAIL || "";
const SMTP_HOST: string = process.env.SMTP_HOST || "";
const SMTP_PORT: number = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const SMTP_USER: string = process.env.SMTP_USER || "";
const SMTP_PASS: string = process.env.SMTP_PASS || "";
const EMAIL_PROVIDER: string = process.env.EMAIL_PROVIDER || "nodemailer"; // future-proof switch
const SENDER_EMAIL : string = process.env.SMTP_USER || "";
const GOOGLE_CLIENT_SECRET : string = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CLIENT_ID : string = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET_KEY : string = process.env.JWT_SECRET_KEY || '';
const BASE_URL : string = BETTER_AUTH_URL;
export { 
    MONGODB_URI, BETTER_AUTH_URL, 
    RESEND_API_KEY, OUR_DOMAIN_EMAIL, 
    SMTP_HOST, SMTP_PORT, SMTP_USER, 
    SMTP_PASS, EMAIL_PROVIDER, SENDER_EMAIL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    JWT_SECRET_KEY, 
    BASE_URL

};