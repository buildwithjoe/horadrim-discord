const Command = require('../bases/Command');
class Test extends Command {
  constructor(client) {
    super(client, {
      aliases: [],
      category: 'Welcome',
      cooldown: 5000,
      name: 'test',
      desc: 'Command for testing commands'
    });
  }

  async exec() {
    console.log()
  }
}
module.exports = Test;
