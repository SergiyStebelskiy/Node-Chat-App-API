import nodemailer from "nodemailer";

export interface IEmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailOptions: IEmailOptions): Promise<void> => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "sergiy.stebelskiy.01@gmail.com",
      pass: "a6wRM1ZPghL389fG",
    },
  });

  await transporter.sendMail(emailOptions);
};
