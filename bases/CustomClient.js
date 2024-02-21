const { Client } = require('discord.js');
const IntentManager = require('./IntentManager');
const { readdirSync } = require('fs');

class CustomClient extends Client {
  constructor() {
    const intents = CustomClient.prepareIntents('./events');
    super(intents);
    this.config = require('../config/client');
    this.token = this.config.token;
    this.commands = new Map();

		this.prefix = this.config.prefix
  }

  static prepareIntents(path) {
    const manager = new IntentManager(path).checkFolder();
    return {
      intents: manager.result
    };
  }

  login() {
    super.login(this.token);
    return this;
  }

  loadEvents(path = './events') {
    const moduleInfo = [];

    readdirSync(path).forEach(name => {
      try {
        const event = require(`../${path}/${name}`);
        super.on(event.name, (...args) => event.exec(this, ...args));
        moduleInfo.push({ type: 'Event', name: event.name, desc: event.desc, status: 'Loaded' });
      } catch (error) {
        moduleInfo.push({ type: 'Event', name: name, desc: error.message, status: 'Failed' });
      }
    });
    console.table(moduleInfo);
    return this;
  }

  loadCommands(path = './commands') {
    const moduleInfo = [];
    readdirSync(path).forEach(name => {
      try {
        const command = new (require(`../${path}/${name}`))(this);
        this.commands.set(command.help.name, command);
        moduleInfo.push({
          type: 'Command',
          name: command.help.name,
          desc: command.help.desc,
          status: 'Loaded'
        });
      } catch (error) {
        moduleInfo.push({ type: 'Command', name: name, desc: error.message, status: 'Failed' });
      }
    });
    console.table(moduleInfo);
    return this;
  }

  isCmd(message) {
    if (message.author.bot || !message.content.startsWith(this.prefix)) return;

    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(this.prefix.length);
    const cmd = this.commands.get(command);

    if (!cmd) return;
    if (cmd.cooldown.has(message.author.id)) return message.delete();
    console.log(cmd.cooldown);
    cmd.setMessage(message);
    cmd.exec(message, args);

    message.delete();

    if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);
    console.log(cmd.cooldown);

    return this;
  }
}

module.exports = CustomClient;
