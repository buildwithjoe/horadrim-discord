
const Timestamp = require('../bases/Timestamp');
module.exports = {
  name: 'ready',
  desc: 'Event triggered at client ready.',
  exec: async function (client) {
    client.log(`Client started at ${new Timestamp(Date.now()).format().formatted}`);
    client.loadCache();
    try {
      const guildsArray = Array.from(await client.guilds.fetch({ cache: true }));
      const status = [];
      for (const guild of guildsArray) {
        const g = Array.from((await client.guilds.fetch(guild.id)).values());
        g.forEach(i => {        
        status.push({
          id: i.id,
          name: i.name
        });
      })
      }
      console.table(status);
    } catch (error) {
      console.error('Error fetching guilds:', error);
    }
  }
};
