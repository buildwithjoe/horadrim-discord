const { GatewayIntentBits } = require('discord.js');
const Timestamp = require('../bases/Timestamp');
module.exports = {
  name: 'ready',
  intent: [GatewayIntentBits.Guilds],
  desc: 'Event triggered at client ready.',
  exec: function () {
    console.table({
      message: `Client has started!`,
      time: `${new Timestamp(Date.now()).format().formatted}`
    });
  }
};
