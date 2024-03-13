const { Events } = require('discord.js');
module.exports = {
  name: Events.GuildMemberRemove,
  desc: 'Event that is triggered when a guild member leaves the guild.',
  exec: async function (client, user) {
    client.logger.info(
      `Member left: ${user.user.username} with display name: ${user.user.globalName}`
    );
  }
};
