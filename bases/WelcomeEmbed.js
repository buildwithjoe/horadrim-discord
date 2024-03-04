const { EmbedBuilder } = require('discord.js');
const Timestamp = require('./Timestamp');

class WelcomeEmbed extends EmbedBuilder {
  constructor(server, user) {
    super();
    this.setupEmbed(server, user);
  }

  setupEmbed(server, user) {
    this.setColor(0x0099ff).setTitle(`Welcome ${user} to ${server}`).setDescription('Please read the rules and enjoy your stay!');

    const timestamp = new Timestamp(Date.now()).format();
    this.addFields({
      name: 'Timestamp',
      value: timestamp.formatted,
      inline: false
    });
  }
}
module.exports = WelcomeEmbed;
