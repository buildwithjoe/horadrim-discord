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
    client.isCmd(message);
    client.counting(message);
    if (message.embeds.length > 0) {
      message.embeds.forEach(embed => {
        const regex = /\[(.*?):(.*?)\]/;
        const matches = regex.exec(embed.title);
        const text = embed.description;
        if (matches) {
          const repo = matches[1].trim();
          const branch = matches[2].trim();
          const combinedRegex = /\[`([^`]*)`\]\((.*?)\)/;

          const match = text.match(combinedRegex);

          [, commitId, url] = match;
          console.log({ repo, branch, commitId, url });
        }
      });
    }
  }
};
