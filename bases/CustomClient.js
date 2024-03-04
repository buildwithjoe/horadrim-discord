const { Client, Partials } = require('discord.js');
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
    this.logger = require('./Pino');
    this.token = this.config.token;
    this.commands = new Map();
    this.cache = new Map();
    this.prefix = this.config.prefix || '.';
    this.logger = new (require('./Pino'))(this);
  }

  static prepareIntents(path) {
    return {
      intents: 3276799,
      partials: [Partials.Channel]
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
        command.aliases.forEach(c => {
          this.commands.set(c, command);
        });
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
    return message.author.bot;
  }

  isCmd(message) {
    if (this.isBot(message) || !message.content.startsWith(this.prefix)) return this;
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(this.prefix.length);
    const cmd = this.commands.get(command);

    if (!cmd) return;
    if (cmd.cooldown.has(message.author.id)) return message.delete();
    cmd.setMessage(message);
    cmd.exec(message, args);
    if(command !== 'delete') message.delete();

    if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);

    return this;
  }

  counting(message) {
    if (this.isBot(message)) return this;
    if (message.channel.id !== process.env.COUNTINGCHANNEL) return this;
    new Count(this, message);
  }

  async loadCache() {
    const guilds = await this.guilds.fetch();
    guilds.forEach(g => {
      this.set(g.id, {
        name: g.name,
        id: g.id,
        count: { current: 0, next: 1, prev: -1, lastUser: 'bot' }
      });
    });

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
  error(msg) {
    this.logger.error(msg);
  }
  log(msg) {
    this.logger.info(msg);
  }
  warn(msg) {
    this.logger.warn(msg);
  }
}

module.exports = CustomClient;
