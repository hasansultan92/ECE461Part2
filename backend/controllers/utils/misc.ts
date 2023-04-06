const fs = require('fs');
require('dotenv').config();

export const validateUrl = (url: string) => {
  if (
    /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    )
  ) {
    return true;
  } else {
    return false;
  }
};

export const log = (message: string, messageFormal: string, code: number) => {
  if (code == undefined) {
    code = parseInt(process.env.LOG_LEVEL!) || 0;
  }
  if (code == 0) {
    return;
  } else if (code == 1) {
    console.log(message);
    return;
  } else if (code == 2) {
    fs.writeFileSync(process.env.LOG_FILE, `${messageFormal}\n`, {flag: 'a'});
    return;
  }
};

export const retrieveEnvVariables = (): any => {
  const logFilePath: string | undefined = process.env.LOG_FILE;
  const mongoLink: string | undefined = process.env.MONGOURL;
  const port: number = parseInt(process.env.PORT!) || 4000;
  const level: number = parseInt(process.env.LOG_LEVEL!) || 0!;
  const github: string = process.env.GITHUB_TOKEN!;

  return {
    logFilePath,
    level,
    mongoLink,
    port,
    github,
  };
};
