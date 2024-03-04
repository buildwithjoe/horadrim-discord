const math = require('mathjs');
const CountingEmbed = require('./CountingEmbed');
class Count {
  constructor(client, message) {
    this.client = client;
    this.count = null;
    this.guildId = message.guild.id;
    this.lastUser = client.get(this.guildId).count.lastUser;
    this.content = message.content;
    this.message = message;
    this.getData();
    this.check();
  }
  static getData(update) {
    if (update !== undefined && update !== null) {
      let data = {
        id: this.guildId,
        name: this.message.guild.name,
        count: {
          current: update,
          prev: update - 1,
          next: update + 1,
          lastUser: this.lastUser
        }
      };
      this.client.set(this.guildId, data);
    }
    this.count = this.client.get(this.guildId).count.current;
    this.next = this.count + 1;
    this.prev = this.count - 1;

    return this;
  }
  static async check() {
    const result = math.evaluate(this.content);
    this.result = result === this.prev || result === this.next;
    if (this.result) {
      this.getData(result);
      const data = {
        user: this.message.author,
        current: this.count,
        next: `${this.count - 1} or ${this.count + 1}`
      };
      this.lastUser = this.message.author;
      const embed = new CountingEmbed(this.message, 'correct', data);
      await embed.respond();
      this.message.delete();

      return this;
    }
    const data = {
      user: this.lastUser,
      current: this.count,
      next: `${this.count - 1} or ${this.count + 1}`
    };
    const embed = new CountingEmbed(this.message, 'incorrect', data);
    await embed.respond();
    this.message.delete();

    return this;
  }
}
module.exports = Count;
