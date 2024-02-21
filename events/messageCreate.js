const { Events, GatewayIntentBits } = require('discord.js');
module.exports = {
  name: Events.MessageCreate,
  intent: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  desc: 'Event that is triggered when a message is sent in a channel.',
  exec: function (client, message) {
    client.isCmd(message)

  }
};
