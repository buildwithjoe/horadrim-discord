const { Events } = require('discord.js');
module.exports = {
  name: Events.MessageCreate,
  desc: 'Event that is triggered when a message is sent in a channel.',
  exec: function (client, message) {
    if (message.author.bot) return;
    client.isCmd(message);
    client.counting(message);
  }
};
