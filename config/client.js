require('dotenv').config();
const config = {
  path: {
    commands: './commands',
    events: './events'
  },
  prefix: process.env.PREFIX,
  token: process.env.TOKEN
};
module.exports = config;
