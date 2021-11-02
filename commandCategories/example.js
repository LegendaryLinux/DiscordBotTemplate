const config = require('../config.json');

module.exports = {
  category: 'Example Category',
  commands: [
    {
      name: 'hello',
      description: 'Say hello to the bot.',
      longDescription: null,
      aliases: ['hey', 'hi'],
      usage: `\`${config.commandPrefix}help hello\``,
      minimumRole: null,
      adminOnly: false,
      guildOnly: true,
      execute(message, args) {
        message.channel.send('Hello, there!');
      },
    },

    {
      name: 'greet',
      description: 'Greet people you specify.',
      longDescription: null,
      aliases: [],
      usage: `\`${config.commandPrefix}help greet\``,
      minimumRole: null,
      adminOnly: false,
      guildOnly: true,
      async execute(message, args) {
        for (let name of args) {
          await message.channel.send(`Hello, ${name}!`)
        }
      },
    }
  ],
};