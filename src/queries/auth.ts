import { NAME_MAX_LENGTH } from "../helpers/validation";
import { IUser } from "../routes/auth";

export const createUserTableQuery = `
  CREATE TABLE Users (
    id int NOT NULL PRIMARY KEY,
    first_name varchar(${NAME_MAX_LENGTH}) NOT NULL,
    last_name varchar(${NAME_MAX_LENGTH}) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    nickname varchar(${NAME_MAX_LENGTH}) NOT NULL UNIQUE,
    password  varchar(255) NOT NULL,
  )
`;

export const createUserQuery = (user: Omit<IUser, "confirmation_code">) => `
    INSERT INTO Users (first_name, last_name, email, nickname, password) VALUES ('${user.first_name}', '${user.last_name}', '${user.email}', '${user.nickname}', '${user.password}' );
`;

export const getUserByEmailQuery = (email: string) => `
    SELECT * FROM Users WHERE email = '${email}';
`;
