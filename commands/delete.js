const Command = require('../bases/Command');
class Delete extends Command {
  constructor(client) {
    super(client, {
      aliases: ['clear'],
      category: 'Moderation',
      cooldown: 5000,
      name: 'delete',
      desc: 'Command for deleting messages'
    });
  }

  async exec(message, args) {
    const amount = parseInt(args[0]) + 1;
    const msgId = args[1];
    switch (true) {
      case isNaN(amount):
        return this.client.logger.error('You need to input a number.');
      case amount <= 1 || amount > 100:
        return this.client.logger.error('You need to input a number between 1 and 99.');
      case msgId:
        return message.channel.messages.fetch(msgId).then(msg => msg.delete());
      default:
        try {
          const messages = await message.channel.messages.fetch({ limit: amount });
          for (let msg of messages.values()) {
            try {
              await msg.delete();
            } catch (err) {
              this.client.logger.error(err);
            }
          }
        } catch (err) {
          this.client.logger.error(err);
        }
    }
  }
}
module.exports = Delete;
