const fs = require('fs');
const path = require('path');

class IntentManager {
  constructor() {
    this.path = './events';
    this.result = null;
  }

  checkFolder() {
    const files = fs.readdirSync(this.path).map(file => path.basename(file, '.js'));
    let moduleIntents = [];
    let status = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const module = require(`../events/${file}`);

      for (let j = 0; j < module.intent.length; j++) {
        const intent = module.intent[j];
        moduleIntents.push(intent);
      }

      status.push({ type: 'Intent', name: module.name, intent: module.intent, status: 'Loaded' });
    }

    let uniqueIntents = [...new Set(moduleIntents)];

    this.result = uniqueIntents;
    console.table(status);
    return this;
  }
}
module.exports = IntentManager;
