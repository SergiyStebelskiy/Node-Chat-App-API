export const generateCode = (): string => {
  let code = "";

  for (let i = 0; i < 6; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    code += randomNumber;
  }

  return code;
};
