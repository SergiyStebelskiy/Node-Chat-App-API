import { NextFunction } from "express";
import { ValidationError } from "./errorHandler";

export const NAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 8;
export const CONFIRMATION_CODE_LENGTH = 6;

export const isValidEmail = (email: string): boolean =>
  Boolean(
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );

export const isValidName = (name: string): boolean =>
  name.length > 0 && name.length < NAME_MAX_LENGTH;

export const isValidPassword = (password: string): boolean => {
  const re = new RegExp(
    `^(?=.*[!@#$%^&*()_+\\-=[\\]{};':\\"\\\\|,.<>\\/?])(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{${PASSWORD_MIN_LENGTH},}$`
  );
  return re.test(password);
};

export const isValidConfirmationCode = (code: string): boolean =>
  code.length === CONFIRMATION_CODE_LENGTH &&
  !code.split("").find((number) => !Number.isInteger(+number));

export const validateEmail = (
  email: string
): ((next: NextFunction) => void) => {
  return (next) => {
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      next(new ValidationError("Email is empty or not valid"));
    }
  };
};

export const validateName = (name: string): ((next: NextFunction) => void) => {
  return (next) => {
    if (typeof name !== "string" || !isValidName(name)) {
      next(
        new ValidationError(
          `Name is empty or not valid. Password must be no more than ${NAME_MAX_LENGTH} characters long`
        )
      );
    }
  };
};

export const validatePassword = (
  password: string
): ((next: NextFunction) => void) => {
  return (next) => {
    if (typeof password !== "string" || !isValidPassword(password)) {
      next(
        new ValidationError(
          `Password is empty or not valid. Password must be at least ${PASSWORD_MIN_LENGTH} characters long, with at least a symbol, upper and lower case letters and a number`
        )
      );
    }
  };
};

export const validateConfirmationCode = (
  code: string,
  savedCode: string
): ((next: NextFunction) => void) => {
  return (next) => {
    if (
      typeof code !== "string" ||
      savedCode !== code ||
      !isValidConfirmationCode(code)
    ) {
      next(
        new ValidationError(
          `Confirmation code is not valid or or does not match the code sent to your email. Code must contain ${CONFIRMATION_CODE_LENGTH} numbers`
        )
      );
    }
  };
};
