import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailVerificationContext } from 'src/common/types/mail';
import {
  emailAndPasswordHtmlMail,
  htmlSendCodeMail,
  HtmlTextMail,
} from './mail.html';

@Injectable()
export class MailService {
  private readonly transporter;
  private readonly user_mail: string;

  constructor(private configService: ConfigService) {
    this.user_mail = this.configService.get('MAIL_USER');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: parseInt(this.configService.get('MAIL_PORT')),
      secure: this.configService.get('MAIL_SECURE') === 'true',
      auth: {
        user: this.user_mail,
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  mailSender = async (
    from: string,
    to: string,
    subject: string,
    html: string,
  ) => {
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      Logger.log(`Code envoyé à ${to}`);
    } catch (err) {
      Logger.error(`Échec d'envoi à ${to} :`, err);
      throw err;
    }
  };

  sendAuthCredential = async (to: string, email: string, password: string) =>
    this.mailSender(
      `"SenWiseTool" <${this.user_mail}>`,
      to,
      'Informations de connexion',
      emailAndPasswordHtmlMail(email, password),
    );

  sendEmailVerificationCode = async (
    to: string,
    code: string,
    context?: EmailVerificationContext,
  ) =>
    this.mailSender(
      `"SenWiseTool" <${this.user_mail}>`,
      to,
      'Informations de connexion',
      htmlSendCodeMail(code, context),
    );

  sendMessage = async (to: string, message: string) =>
    this.mailSender(
      `"SenWiseTool" <${this.user_mail}>`,
      to,
      'Informations de connexion',
      HtmlTextMail(message),
    );

  // async sendVerificationCode(to: string, code: string) {
  //   const html = `
  //   <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px;">
  //     <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">

  //       <div style="text-align: center; margin-bottom: 20px;">
  //         <div style="font-size: 32px; color: #1F3B4D; font-weight: bold;">
  //           📩<span style="color: #F6C90E;">Sen</span><span style="color: #1F3B4D;">Wise</span><span style="color:rgb(30, 148, 0);">Tool</span>
  //         </div>
  //         <div style="font-size: 14px; color: #888;">La digitalisation des services de traçabilité.</div>
  //       </div>

  //       <p style="font-size: 16px; color: #333;">Bonjour,</p>
  //       <p style="font-size: 16px; color: #333;">
  //         Votre code de vérification :
  //       </p>

  //       <div style="text-align: center; margin: 20px 0;">
  //         <span style="display: inline-block; background-color: #F6C90E; color: #1F3B4D; font-size: 24px; font-weight: bold; padding: 12px 24px; border-radius: 6px;">
  //           ${code}
  //         </span>
  //       </div>

  //       <p style="font-size: 14px; color: #555;">
  //         Ce code est valable pendant quelques minutes. Si vous ne l'avez pas demandé, veuillez ignorer ce message.
  //       </p>

  //       <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
  //         — L’équipe <strong>SenWiseTool</strong>
  //       </p>
  //     </div>
  //   </div>
  // `;

  //   const mailOptions = {
  //     from: `"SenWiseTool" <${this.user_mail}>`,
  //     to,
  //     subject: 'Votre code de vérification',
  //     html: html,
  //   };

  //   try {
  //     await this.transporter.sendMail(mailOptions);
  //     Logger.log(`Code envoyé à ${to}`);
  //   } catch (err) {
  //     Logger.error(`Échec d'envoi à ${to} :`, err);
  //     throw err;
  //   }
  // }

  async sendResetPasswordEmail(to: string, link: string) {
    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
      <div style="max-width: 520px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); padding: 32px;">

        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://senwisetool.com/images/logo.png" alt="SenWiseTool Logo" style="height: 60px;"/>
        </div>

        <!-- Titre branding -->
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="font-size: 32px; font-weight: bold; color: #1F3B4D;">
            🔐<span style="color: #F6C90E;">Sen</span><span style="color: #1F3B4D;">Wise</span><span style="color:rgb(30, 148, 0);">Tool</span>
          </div>
          <div style="font-size: 13px; color: #888888;">
            La digitalisation des services de traçabilité.
          </div>
        </div>

        <p style="font-size: 16px; color: #333333;">Bonjour,</p>
        <p style="font-size: 16px; color: #333333; line-height: 1.5;">
          Vous avez demandé la réinitialisation de votre mot de passe. Pour procéder, veuillez cliquer sur le bouton ci-dessous :
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #F6C90E; color: #1F3B4D; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </div>

        <p style="font-size: 14px; color: #555555; line-height: 1.5;">
          Ce lien est valable pendant quelques minutes. Si vous n’avez pas demandé cette réinitialisation, vous pouvez ignorer ce message en toute sécurité.
        </p>

        <p style="font-size: 14px; color: #999999; text-align: center; margin-top: 40px;">
          — L’équipe <strong>SenWiseTool</strong>
        </p>
      </div>
    </div>
  `;

    const mailOptions = {
      from: `"SenWise Auth" <${this.user_mail}>`,
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
