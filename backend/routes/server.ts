require('dotenv').config();
import {log, retrieveEnvVariables} from '../controllers/utils/misc';
const envVars: any = retrieveEnvVariables();
const {logFilePath, level, mongoLink, port, github} = envVars; // retrive all environment variables
//console.log('here', logFilePath, typeof level, mongoLink, port);

if (!mongoLink) {
  log('URL for mongoDB not found', 'URL for mongoDB not found', level);
  process.exit(1);
}

import {connect} from '../controllers/Database/database';
const connection: number = connect(level, mongoLink);
connection ? 1 : process.exit(1);

// Express imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

try {
  // Backend configuration
  app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(cors());

  //Initialize the route endpoint and modules being passed
  try {
    const child_process = require('child_process');
    child_process.execSync(
      `mkdir ../packages/ && mkdir ../controllers/API/packages/`
    );
  } catch (e: any) {
    //console.log(e);
  }
  const router = require('./apiRouter')(express);
  app.use('/', router);
  app.use(express.static('./public'));

  // Run the backend (magic)
  const server = app.listen(port, (req: any, res: any) => {
    console.log(`Server is active on Port : ${port}`);
  });

  app.get('/', (req: any, res: any) => {
	  res.sendFile(__dirname + "/index.html");
  });

} catch (error: any) {
  console.error(error);
  log(error, error.stack, level);
}
