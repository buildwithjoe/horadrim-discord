class Command {
  constructor(client, options) {
    /**
     * The client used in the command
     * @type {CustomClient}
     */
    this.client = client;
    /**
     * The command's information properties
     * @type {Object}
     */
    this.help = {
      category: options.category || 'Information',
      desc: options.desc || 'No information specified.',
      name: options.name || null,
      usage: options.usage || ''
    };
    /**
     * The command's configuration
     * @type {Object}
     */
    this.conf = {
      aliases: options.aliases || [],
      cooldown: options.cooldown || 1000
    };
    /**
     * A set of the IDs of the users on cooldown
     * @type {Set}
     */
    this.cooldown = new Set();
  }

  /**
   * Puts a user on cooldown
   * @param {String} user The ID of the user to put on cooldown
   */
  startCooldown(user) {
    this.cooldown.add(user);

    setTimeout(() => {
      this.cooldown.delete(user);
    }, this.conf.cooldown);
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  respond(message) {
    this.message.channel.send(message);
    return this;
  }
}

module.exports = Command;
