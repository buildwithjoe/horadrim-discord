const { EmbedBuilder } = require('discord.js');

class CountingEmbed extends EmbedBuilder {
  constructor(message, type, data) {
    super();
    this.message = message;
    switch (type) {
      case 'correct':
        this.setupType1(data);
        break;
      case 'incorrect':
        this.setupType2(data);
        break;
      default:
        throw new Error('Invalid embed type specified');
    }
  }

  setupType1({ user, current, next }) {
    this.setColor(0x0099ff)
      .setTitle('Counting Correct!')
      .setDescription('For more info read below')
      .addFields(
        { name: 'Last count user', value: String(user), inline: false },
        { name: 'Current', value: String(current), inline: false },
        { name: 'Next', value: String(next), inline: false }
      );
  }

  setupType2({ user, current, next }) {
    this.setColor(0xff0000)
      .setTitle('Counting incorrect!')
      .setDescription('For more info read below')
      .addFields(
        { name: 'Last count user', value: String(user), inline: false },
        { name: 'Current', value: String(current), inline: false },
        { name: 'Next', value: String(next), inline: false }
      );
  }

  async respond() {
    await this.message.reply({ embeds: [this] });
  }
}
module.exports = CountingEmbed;
