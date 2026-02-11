import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
): Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject,
            html
        });
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

export const sendWelcomeEmail = async (
    email: string,
    name: string
): Promise<boolean> => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LifeSCC!</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for registering with Life Slimming & Cosmetic Clinic. We're excited to be part of your beauty transformation journey!</p>
          <p>With LifeSCC, you can:</p>
          <ul>
            <li>Browse our wide range of cosmetic treatments</li>
            <li>Book appointments at your convenience</li>
            <li>Track your treatment history</li>
            <li>Get personalized recommendations</li>
          </ul>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/patient/book" class="button">Book Your First Appointment</a>
          </p>
          <p>If you have any questions, feel free to reach out to us at any of our 10+ branches across Telangana and Andhra Pradesh.</p>
          <p>Best regards,<br>The LifeSCC Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Life Slimming & Cosmetic Clinic. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    return sendEmail(email, 'Welcome to LifeSCC', html);
};

export const sendAppointmentConfirmationEmail = async (
    email: string,
    appointmentDetails: {
        patientName: string;
        serviceName: string;
        branchName: string;
        date: string;
        time: string;
        branchAddress: string;
        branchPhone: string;
    }
): Promise<boolean> => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .appointment-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Appointment Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${appointmentDetails.patientName},</p>
          <p>Your appointment has been confirmed. Here are the details:</p>
          
          <div class="appointment-card">
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${appointmentDetails.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${appointmentDetails.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${appointmentDetails.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Branch:</span>
              <span class="detail-value">${appointmentDetails.branchName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Address:</span>
              <span class="detail-value">${appointmentDetails.branchAddress}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact:</span>
              <span class="detail-value">${appointmentDetails.branchPhone}</span>
            </div>
          </div>
          
          <p><strong>Important Notes:</strong></p>
          <ul>
            <li>Please arrive 10 minutes before your appointment time</li>
            <li>Bring a valid ID proof</li>
            <li>If you need to reschedule or cancel, please inform us at least 24 hours in advance</li>
          </ul>
          
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br>The LifeSCC Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Life Slimming & Cosmetic Clinic. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    return sendEmail(email, 'Appointment Confirmation - LifeSCC', html);
};

export const sendPasswordResetEmail = async (
    email: string,
    name: string,
    resetToken: string
): Promise<boolean> => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #FFF3CD; border: 1px solid #FFC107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We received a request to reset your password for your LifeSCC account.</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Security Note:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email or contact our support team.
          </div>
          
          <p>Best regards,<br>The LifeSCC Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Life Slimming & Cosmetic Clinic. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    return sendEmail(email, 'Password Reset - LifeSCC', html);
};
