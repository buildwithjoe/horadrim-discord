const { EmbedBuilder } = require('discord.js');
const Timestamp = require('./Timestamp');

class LoggingEmbed extends EmbedBuilder {
  constructor(level, msg, time) {
    super();
    switch (level) {
      case 30:
        this.setColor(0x0099ff).setTitle('Info Log');
        break;
      case 40:
        this.setColor(0xffcc00).setTitle('Warning Log');
        break;
      case 50:
        this.setColor(0xff0000).setTitle('Error Log');
        break;
      default:
        this.setColor(0x808080).setTitle('Log');
        break;
    }
    const timestamp = new Timestamp(time).format();
    this.setDescription(msg).addFields({
      name: 'Timestamp',
      value: timestamp.formatted,
      inline: false
    });
  }
}
module.exports = LoggingEmbed;
