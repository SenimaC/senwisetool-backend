import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      // secure: process.env.MAIL_SECURE === 'true', // true pour port 465, false pour 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendVerificationCode(to: string, code: string) {
    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">
  
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 32px; color: #1F3B4D; font-weight: bold;">
            🧠<span style="color: #F6C90E;">Sen</span><span style="color: #1F3B4D;">Wise</span><span style="color:rgb(30, 148, 0);">Tool</span>
          </div>
          <div style="font-size: 14px; color: #888;">La digitalisation des services de traçabilité.</div>
        </div>
  
        <p style="font-size: 16px; color: #333;">Bonjour,</p>
        <p style="font-size: 16px; color: #333;">
          Votre code de vérification :
        </p>
  
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; background-color: #F6C90E; color: #1F3B4D; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px;">
            ${code}
          </span>
        </div>
  
        <p style="font-size: 14px; color: #555;">
          Ce code est valable pendant quelques minutes. Si vous ne l'avez pas demandé, veuillez ignorer ce message.
        </p>
  
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
          — L’équipe <strong>SenWiseTool</strong>
        </p>
      </div>
    </div>
  `;

    const mailOptions = {
      from: `"SenWise Auth" <${process.env.MAIL_USER}>`,
      to,
      subject: 'Votre code de vérification',
      html: html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      Logger.log(`Code envoyé à ${to}`);
    } catch (err) {
      Logger.error(`Échec d'envoi à ${to} :`, err);
      throw err;
    }
  }
}
