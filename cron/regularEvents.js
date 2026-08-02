const { Client, GatewayIntentBits } = require('discord.js');
const config = require('../config.json');

// Create the Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.login(config.token).then(async () => {
  try{
    // Perform some regularly occurring operation

    // Cleanly close the connection to Discord
    return client.destroy();
  }catch(Error) {
    console.error(Error);
    return client.destroy();
  }
});
