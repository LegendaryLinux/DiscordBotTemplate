const { Discord, Client, Intents } = require('discord.js');
const config = require('../config.json');

// Create the Discord client
const client = new Client({
  intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES ],
});

client.login(config.token).then(async () => {
  try{
    // Perform some regularly occurring operation

    // Cleanly close the connection to Discord
    client.destroy();
  }catch(Error) {
    console.error(Error);
    client.destroy();
  }
});
