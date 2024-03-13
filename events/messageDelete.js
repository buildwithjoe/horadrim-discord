const { Events } = require('discord.js');
module.exports = {
  name: Events.MessageDelete,
  desc: 'Event that is triggered when a message is deleted in a channel.',
  exec: function (client, message) {
    client.logger.error(
      `Message deleted in ${message.channel.name} by ${message.author.tag}\n Content: ${message.content}`
    );
  }
};
