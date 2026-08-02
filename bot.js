const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js')
const config = require('./config.json');
const { generalErrorHandler } = require('./errorHandlers');
const { cachePartial, registerSlashCommands } = require('./lib');

// Catch all unhandled errors
process.on('uncaughtException', (err) => generalErrorHandler(err));

const client = new Client({
  partials: [ Partials.GuildMember, Partials.Message, Partials.Reaction ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,

    // Privileged intent, which must be enabled in the Discord Developer Portal page for your bot
    // GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();

const messageCreate = require('./clientEvents/messageCreate');
client.on('messageCreate', async (msg) => {
  // Fetch message if partial
  const message = await cachePartial(msg);
  if (message.member) { message.member = await cachePartial(message.member); }
  if (message.author) { message.author = await cachePartial(message.author); }

  // Ignore all bot messages
  if (message.author.bot) { return; }

  return messageCreate(client, message);
});

// Route various Discord client events to their appropriate handlers
const messageUpdate = require('./clientEvents/messageUpdate');
client.on('messageUpdate', async (message) => messageUpdate(client, message));

const messageDelete = require('./clientEvents/messageDelete');
client.on('messageDelete', async (message) => messageDelete(client, message));

const messageReactionAdd = require('./clientEvents/messageReactionAdd');
client.on('messageReactionAdd', async (messageReaction, user) => messageReactionAdd(client, messageReaction, user));

const messageReactionRemove = require('./clientEvents/messageReactionRemove');
client.on('messageReactionRemove', async (messageReaction, user) =>
  messageReactionRemove(client, messageReaction, user));

const voiceStateUpdate = require('./clientEvents/voiceStateUpdate');
client.on('voiceStateUpdate', async (oldState, newState) => voiceStateUpdate(client, oldState, newState));

const guildCreate = require('./clientEvents/guildCreate');
client.on('guildCreate', async (guild) => guildCreate(client, guild));

const guildDelete = require('./clientEvents/guildDelete');
client.on('guildDelete', async (guild) => guildDelete(client, guild));

// Handle slash commands when their events occur
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) { return; }

    return await command.execute(interaction);
  }
});

// Use the general error handler to handle unexpected errors
client.on('error', async(error) => generalErrorHandler(error));

client.once('ready', async() => {
  await registerSlashCommands(client);
  console.log(`Connected to Discord. Active in ${client.guilds.cache.size} guilds.`);
});

return client.login(config.token);