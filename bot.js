const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');
const { generalErrorHandler } = require('./errorHandlers');
const { cachePartial, registerSlashCommands } = require('./lib');

const loadModules = (directory) => {
  return fs.readdirSync(path.join(__dirname, directory))
    .filter((file) => file.endsWith('.js'))
    .map((file) => require(path.join(__dirname, directory, file)));
}

// Catch all unhandled errors
process.on('uncaughtException', (err) => generalErrorHandler(err));

const client = new Client({
  partials: [ Partials.GuildMember, Partials.Message, Partials.Reaction ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,

    // Privileged intent, which must be enabled in the Discord Developer Portal page for your bot
    // GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
client.messageCreateListeners = loadModules('clientEventListeners/messageCreate');
client.messageUpdateListeners = loadModules('clientEventListeners/messageUpdate');
client.messageDeleteListeners = loadModules('clientEventListeners/messageDelete');
client.messageReactionAddListeners = loadModules('clientEventListeners/messageReactionAdd');
client.messageReactionRemoveListeners = loadModules('clientEventListeners/messageReactionRemove');
client.voiceStateUpdateListeners = loadModules('clientEventListeners/voiceStateUpdate');
client.guildCreateListeners = loadModules('clientEventListeners/guildCreate');
client.guildDeleteListeners = loadModules('clientEventListeners/guildDelete');
client.buttonListeners = loadModules('interactionListeners/buttons');
client.modalListeners = loadModules('interactionListeners/modals');
const routines = loadModules('routines');

client.on(Events.MessageCreate, async (msg) => {
  // Fetch message if partial
  const message = await cachePartial(msg);

  // Ignore all bot messages
  if (message.author.bot) { return; }

  return Promise.all(client.messageCreateListeners.map(
    (listener) => listener(client, message)
  ));
});

client.on(Events.MessageUpdate, async (oldMsg, newMsg) => {
  const [oldMessage, newMessage] = await Promise.all([cachePartial(oldMsg), cachePartial(newMsg)]);
  if (newMessage.author.bot) { return; }

  return Promise.all(client.messageUpdateListeners.map(
    (listener) => listener(client, oldMessage, newMessage)
  ));
});

client.on(Events.MessageDelete, async (message) =>
  Promise.all(client.messageDeleteListeners.map(
    (listener) => listener(client, message)
  ))
);

client.on(Events.MessageReactionAdd, async (messageReaction, user) => {
  messageReaction = await cachePartial(messageReaction);
  messageReaction.message = await cachePartial(messageReaction.message);
  return Promise.all(client.messageReactionAddListeners.map(
    (listener) => listener(client, messageReaction, user)
  ));
});

client.on(Events.MessageReactionRemove, async (messageReaction, user) => {
  messageReaction = await cachePartial(messageReaction);
  messageReaction.message = await cachePartial(messageReaction.message);
  return Promise.all(client.messageReactionRemoveListeners.map(
    (listener) => listener(client, messageReaction, user)
  ));
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  await Promise.all([
    cachePartial(oldState.member),
    cachePartial(newState.member),
  ]);
  return Promise.all(client.voiceStateUpdateListeners.map(
    (listener) => listener(client, oldState, newState)
  ));
});

client.on(Events.GuildCreate, async (guild) => {
  return Promise.all(client.guildCreateListeners.map(
    (listener) => listener(client, guild)
  ))
});

client.on(Events.GuildDelete, async (guild) => {
  return Promise.all(client.guildDeleteListeners.map(
    (listener) => listener(client, guild)
  ))
});

// Handle slash commands when their events occur
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) { return; }

    return command.execute(interaction);
  }

  if (interaction.isButton()) {
    return Promise.all(client.buttonListeners.map((listener) => listener(client, interaction)));
  }

  if (interaction.isModalSubmit()) {
    return Promise.all(client.modalListeners.map((listener) => listener(client, interaction)));
  }
});

// Use the general error handler to handle unexpected errors
client.on(Events.Error, async(error) => generalErrorHandler(error));

client.once(Events.ClientReady, async() => {
  await registerSlashCommands(client);

  const runRoutine = async (routine) => {
    try {
      await routine(client);
    } catch (error) {
      generalErrorHandler(error);
    }
  };

  await Promise.all(routines.map(runRoutine));
  routines.forEach((routine) => setInterval(() => runRoutine(routine), 60 * 60 * 1000));

  console.info(`Connected to Discord. Active in ${client.guilds.cache.size} guilds.`);
});

return client.login(config.token);
