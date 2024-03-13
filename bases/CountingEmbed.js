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

  setupType1({ user, current, next, extra }) {
    this.setColor(0x0099ff)
      .setTitle('Counting Correct!')
      .setDescription('For more info read below')
      .addFields(
        { name: 'Input', value: String(this.message.content), inline: false },
        { name: 'Formula', value: String(`${this.message.content} = ${current}`), inline: false },
        { name: 'Last Count User', value: String(user), inline: false },
        { name: 'Current', value: String(current), inline: false },
        { name: 'Next', value: String(next), inline: false },
        {
          name: 'Timestamp',
          value: new Date().toLocaleString({
            timeStyle: 'short',
            dateStyle: 'short',
            timeZoneName: 'short'
          }),
          inline: false
        }
      );
    if (extra !== undefined) this.addFields({ name: 'Extra', value: String(extra), inline: false });
  }

  setupType2({ user, current, next }) {
    this.setColor(0xff0000)
      .setTitle('Counting Incorrect!')
      .setDescription('For more info read below')
      .addFields(
        { name: 'Input', value: String(this.message.content), inline: false },
        { name: 'Formula', value: String(`${this.message.content} = ${current}`), inline: false },
        { name: 'Last count user', value: String(user), inline: false },
        { name: 'Current', value: String(current), inline: false },
        { name: 'Next', value: String(next), inline: false },
        {
          name: 'Timestamp',
          value: new Date().toLocaleString({
            timeStyle: 'short',
            dateStyle: 'short',
            timeZoneName: 'short'
          }),
          inline: false
        }
      );
  }

  async respond() {
    await this.message.channel.send({ embeds: [this] });
  }
}
module.exports = CountingEmbed;
