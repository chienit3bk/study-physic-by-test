const {Client } = require('pg');

import { PGS_DATABASE_CONFIG } from '../config';

const client = new Client(PGS_DATABASE_CONFIG);

client.connect(function(err) {
  if (err)  {
    throw err;
  }

  console.log("Connected to PortgreSQL !");
})
