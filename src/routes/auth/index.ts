import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import jwt from "jsonwebtoken";
import { mysqlConnection } from "../..";
import { sendEmail, IEmailOptions } from "../../helpers/sendEmail";
import { generateCode } from "../../helpers/generateCode";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateConfirmationCode,
} from "../../helpers/validation";
import { createUserQuery, getUserByEmailQuery } from "../../queries/auth";
import { InternalServerError, NotFoundError } from "../../helpers/errorHandler";

const router = express.Router();
const templatesDir = path.join(__dirname, "../..", "email-templates");

interface IConfirmationCodes {
  [key: string]: string;
}
export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  nickname: string;
  password: string;
  confirmation_code: string;
}
const confirmationCodes: IConfirmationCodes = {
  // "priler110@gmail.com": "916849",
};

router.post("/confirmation-email", (req, res, next) => {
  const email = String(req.query.email_address);

  validateEmail(email)(next);
  nunjucks.configure(templatesDir);
  const randomCode = generateCode();
  confirmationCodes[email] = randomCode;
  const htmlTemplate: string = nunjucks.render("confirmation-email.html", {
    code: randomCode,
  });

  const emailOptions: IEmailOptions = {
    from: "Chat App Admin <chat.admin@gmail.com>",
    to: email,
    subject: "Email confirmation",
    html: htmlTemplate,
  };
  sendEmail(emailOptions).catch(console.error);
  res.json({ message: `email successfully sent to ${email}` });
});

router.post("/registration", (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    nickname,
    password,
    confirmation_code,
  }: IUser = req.body;

  validateName(first_name)(next);
  validateName(last_name)(next);
  validateEmail(email)(next);
  validateName(nickname)(next);
  validatePassword(password)(next);
  validateConfirmationCode(confirmation_code, confirmationCodes[email])(next);

  mysqlConnection.query(
    createUserQuery({
      first_name,
      last_name,
      email,
      nickname,
      password,
    }),
    async function (err, rows, fields) {
      if (err) next(new InternalServerError(err.message));
      else {
        try {
          const access_token = await jwt.sign(
            { email, nickname, password },
            "jdfDj734Nhs",
            { expiresIn: "3h" }
          );
          const refresh_token = await jwt.sign(
            { email, nickname, password },
            "jdfDj734Nhs",
            { expiresIn: "18h" }
          );
          res
            .status(201)
            .json({ insertId: rows?.insertId, access_token, refresh_token });
        } catch (error: unknown) {
          if (error instanceof Error)
            next(new InternalServerError(error.message));
        }
      }
    }
  );
});

router.get("/authorization", (req, res, next) => {
  const { email, password }: IUser = req.body;
  validateEmail(email)(next);
  validatePassword(password)(next);
  mysqlConnection.query(
    getUserByEmailQuery(email),
    async function (err, rows, fields) {
      if (err) {
        next(new InternalServerError(err.message));
      } else {
        try {
          if (!rows.length)
            next(new NotFoundError("User not found in database"));

          const {
            email,
            nickname,
            password: originalPassword,
            ...user
          } = rows?.[0];
          if (originalPassword !== password)
            next(new NotFoundError("User not found in database"));
          else {
            const access_token = await jwt.sign(
              { email, nickname, password },
              "jdfDj734Nhs",
              { expiresIn: "3h" }
            );
            const refresh_token = await jwt.sign(
              { email, nickname, password },
              "jdfDj734Nhs",
              { expiresIn: "18h" }
            );
            res.status(201).json({
              access_token,
              refresh_token,
              user: { email, nickname, ...user },
            });
          }
        } catch (error: unknown) {
          if (error instanceof Error)
            next(new InternalServerError(error.message));
        }
      }
    }
  );
});

export default router;
