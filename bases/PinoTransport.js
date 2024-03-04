const { Writable } = require('stream');
const LoggingEmbed = require('./LoggingEmbed');

class PinoTransport extends Writable {
  constructor(client, options = {}) {
    super({ ...options, objectMode: true });
    this.client = client;
    this.channelId = process.env.LOGCHANNEL;
  }

  _write(chunk, encoding, callback) {
    const { level, msg, time } = JSON.parse(chunk);
    this.client.channels
      .fetch(this.channelId)
      .then(channel => {
        const embed = new LoggingEmbed(level, msg, time);
        return channel.send({ embeds: [embed] });
      })
      .then(() => callback())
      .catch(err => callback(err));
  }
}

module.exports = PinoTransport;
