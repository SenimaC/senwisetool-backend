import { EmailVerificationContext } from 'src/common/types/mail';

export const emailAndPasswordHtmlMail = (email: string, password: string) => {
  const baseUrl = process.env.BASE_URL;

  return `<div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 35px;">
  <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
    <h2 style="font-size: 24px; color: #111827; font-weight: 700; margin-bottom: 10px;">
      Bienvenue !
    </h2>
    <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
      Vos identifiants de connexion sont prêts. Veuillez les conserver en lieu sûr et ne les partagez jamais.
    </p>

    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <p style="font-weight: 600; margin: 0; color: #6b7280; font-size: 16px;">Email</p>
      <p style="color: #111827; font-size: 14px;">${email}</p>

      <p style="font-weight: 600; margin-top: 15px; color: #6b7280; font-size: 16px;">Mot de passe</p>
      <p style="color: #111827; font-size: 14px;">${password}</p>
    </div>

    <p style="font-size: 14px; color: #374151; margin-bottom: 20px;">
      Pour votre sécurité :
      <ul style="padding-left: 20px; color: #4b5563; font-size: 14px; s">
        <li>Ne partagez jamais vos identifiants.</li>
        <li>Changez votre mot de passe régulièrement.</li>
        <li>Ne vous connectez que depuis un appareil sécurisé.</li>
        <li>En cas de doute, contactez notre support immédiatement.</li>
      </ul>
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${baseUrl}/auth" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Se connecter maintenant
      </a>
    </div>

    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; text-align: center;">
      Ce message est confidentiel. Si vous n'êtes pas le destinataire prévu, merci de le supprimer immédiatement.
    </p>
  </div>
</div>
`;
};

export const htmlSendCodeMail = (
  code: string,
  context?: EmailVerificationContext,
) => {
  const baseUrl = process.env.BASE_URL;
  const currentContext = context ?? 'DEFAULT';

  const titles = {
    USER: 'Vérification de votre adresse email utilisateur',
    COMPANY: 'Vérification de l’email de votre entreprise',
    DEFAULT: 'Vérification de votre adresse email',
  };

  const instructions = {
    USER: `Pour finaliser la vérification de votre compte utilisateur, veuillez utiliser le code ci-dessous.`,
    COMPANY: `Pour finaliser la création de votre entreprise, merci de confirmer votre adresse email.`,
    DEFAULT: `Veuillez utiliser le code ci-dessous pour compléter votre vérification.`,
  };

  const reason = {
    USER: 'Vous avez demandé à vérifier votre adresse email utilisateur.',
    COMPANY:
      'Vous avez initié la vérification de l’adresse email de votre entreprise.',
    DEFAULT: 'Une vérification d’email a été demandée.',
  };

  return `<div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 35px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
      <h2 style="font-size: 24px; color: #111827; font-weight: 700; margin-bottom: 10px;">
        ${titles[currentContext]}
      </h2>
      <p style="font-size: 16px; color: #4b5563; margin-bottom: 20px;">
        ${instructions[currentContext]} Ce code est confidentiel et expire dans <strong>2 minutes</strong>.
      </p>

      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <p style="font-size: 14px; color: #6b7280; margin: 0;">Votre code de vérification :</p>
        <p style="font-size: 28px; color: #111827; font-weight: bold; letter-spacing: 2px; margin: 10px 0;">${code}</p>
        <p style="font-size: 12px; color: #9ca3af;">Valide pendant 2 minutes uniquement</p>
      </div>

      <p style="font-size: 14px; color: #374151; margin-bottom: 20px;">
        Pour votre sécurité :
        <ul style="padding-left: 20px; color: #4b5563; font-size: 14px;">
          <li>Ne partagez jamais ce code avec qui que ce soit.</li>
          <li>Assurez-vous d’être bien à l’origine de cette demande.</li>
          <li>Utilisez ce code uniquement sur notre plateforme officielle.</li>
          <li>En cas de doute, ignorez ce message et contactez notre support.</li>
        </ul>
      </p>

      <p style="font-size: 13px; color: #6b7280; margin-bottom: 10px;">
        ${reason[currentContext]} Si ce n’est pas vous, ignorez ce message.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="${baseUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Accéder à la plateforme
        </a>
      </div>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; text-align: center;">
        Ce message est strictement confidentiel. Si vous n'êtes pas le destinataire prévu, merci de le supprimer immédiatement.
      </p>
    </div>
  </div>`;
};

export const HtmlTextMail = (message: string) => {
  const baseUrl = process.env.BASE_URL;

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 35px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
      <h2 style="font-size: 24px; color: #111827; font-weight: 700; margin-bottom: 10px;">
        SENDWISETOOL
      </h2>

      <div style="font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap; margin-bottom: 30px;">
        ${message}
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${baseUrl}/auth" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Se connecter maintenant
        </a>
      </div>

      <p style="font-size: 12px; color: #9ca3af; margin-top: 30px; text-align: center;">
        Ce message est confidentiel. Si vous n'êtes pas le destinataire prévu, merci de le supprimer immédiatement.
      </p>
    </div>
  </div>
  `;
};
