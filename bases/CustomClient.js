const { Client } = require('discord.js');
const IntentManager = require('./IntentManager');
const { readdirSync } = require('fs');
const Count = require('./Count');

class CustomClient extends Client {
  constructor() {
    const intents = CustomClient.prepareIntents('./events');
    super(intents);
    this.type = ['events', 'commands'];
    this.eventsPath = './events';
    this.commandPath = './commands';
    this.config = require('../config/client');
    this.token = this.config.token;
    this.commands = new Map();
    this.cache = new Map();
    this.prefix = this.config.prefix || '.';
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

  load() {
    this.type.forEach(type => this.loadModules(type));
    return this;
  }

  loadModules(type, path = `./${type}`) {
    const moduleInfo = [];
    const moduleTypeHandlers = {
      events: (module, name) => {
        super.on(module.name, (...args) => module.exec(this, ...args));
        return { name: module.name, desc: module.desc };
      },
      commands: (module, name) => {
        const command = new module(this);
        this.commands.set(command.help.name, command);
        return { name: command.help.name, desc: command.help.desc };
      }
    };

    readdirSync(path).forEach(name => {
      try {
        const module = require(`../${path}/${name}`);
        if (!moduleTypeHandlers[type]) {
          throw new Error(`Invalid module type: ${type}`);
        }

        const { name: moduleName, desc } = moduleTypeHandlers[type](module, name);
        moduleInfo.push({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          name: moduleName,
          desc: desc,
          status: 'Loaded'
        });
      } catch (error) {
        moduleInfo.push({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          name: name,
          desc: error.message,
          status: 'Failed'
        });
      }
    });

    console.table(moduleInfo);
    return this;
  }

  isBot(message) {
    if (message.author.bot) return true;
    return false;
  }

  isCmd(message) {
    if (this.isBot(message) || !message.content.startsWith(this.prefix)) return this;
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

  counting(message) {
    if (this.isBot(message)) return this;
    const count = new Count(this, message).getData().check();

  }
  async loadCache() {
    const guilds = await this.guilds.fetch();
    guilds.forEach(g => {
    this.set(g.id, { name: g.name, id: g.id, count: {current: 0, next: 1, prev:-1, lastUser: 'bot'}});
    });
    this.cache.forEach(c => console.log(c));
    return this;
  }
  get(serverId) {
    return this.cache.get(serverId);
  }
  set(serverId, value) {
    this.cache.set(serverId, value);
  }
  invalidate(serverId) {
    this.cache.delete(serverId);
  }
}

module.exports = CustomClient;
