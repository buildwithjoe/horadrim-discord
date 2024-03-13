const math = require('mathjs');
const CountingEmbed = require('./CountingEmbed');
const LeaderBoard = require('./CountLeaderBoard');
class Count {
  constructor(client, message) {
    this.client = client;
    this.guildId = message.guild.id;
    this.content = message.content;
    this.leaderBoard = new LeaderBoard(this.client, this.guildId);
    this.message = message;
    this.check();
  }
  get cache() {
    return this.client.cache;
  }
  get count() {
    return this.client.get(this.guildId).count.get('current').current;
  }

  get prev() {
    const currentCount = this.client.get(this.guildId).count.get('current').current;
    return currentCount - 1;
  }

  get next() {
    const currentCount = this.client.get(this.guildId).count.get('current').current;
    return currentCount + 1;
  }
  z;
  get user() {
    return this.client.get(this.guildId).count.get('current').user;
  }

  getData(update) {
    const data = {
      current: update,
      prev: update - 1,
      next: update + 1,
      user: this.message.author
    };
    this.client
      .get(this.guildId)
      .count.set('last', this.client.get(this.guildId).count.get('current'));
    this.client.get(this.guildId).count.set('current', data);
    this.leaderBoard.addScore(this.message.author.id, 1);
    return this;
  }
  checkExtra(result) {
    const extras = {
      42: 'Ultimate Question of Life, the Universe, and Everything...',
      69: 'Nice.',
      420: 'Smoke one.',
      666: 'The Number of the Beast.',
      777: 'Lucky.',
      1337: 'Leet.'
    };

    return extras[result] || undefined;
  }

  async handleResult(result) {
    const data = {
      user: this.message.author,
      current: this.count,
      next: `${this.count - 1} or ${this.count + 1}`
    };
    
    const isCorrect = result === this.prev || result === this.next;
    if (isCorrect){
      this.getData(result);
    }
    const embedType = isCorrect ? 'correct' : 'incorrect';
    const extra = isCorrect ? this.checkExtra(result) : undefined;

    data.extra = extra;

    const embed = new CountingEmbed(this.message, embedType, data);
    await embed.respond();
    await this.message.delete();
    return this;
  }

  async check() {
    const result = math.evaluate(this.content);
    await this.handleResult(result);
    return this;
  }
}
module.exports = Count;
