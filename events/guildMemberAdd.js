const { Events } = require('discord.js');
const WelcomeEmbed = require('../bases/WelcomeEmbed');
module.exports = {
  name: Events.GuildMemberAdd,
  desc: 'Event that is triggered when a guild member is added to the guild.',
  exec: async function (client, user) {
    client.logger.info(
      `Member joined: ${user.user.username} with display name: ${user.user.globalName}`
    );
    const member = await user.guild.members.fetch(user.user.id);
    member.roles.set(['1214045460545933403']);
    const embed = new WelcomeEmbed(user.guild.name, user.user.username);
    const channel = await user.guild.channels.fetch(process.env.WELCOMECHANNEL);
    channel.send({ embeds: [embed] });
  }
};
