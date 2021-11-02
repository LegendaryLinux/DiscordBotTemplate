const { Discord, Role } = require('discord.js');
const { generalErrorHandler } = require('./errorHandlers');
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");
const config = require('./config.json');

module.exports = {
  /**
   * Determine if a user has administrator permissions in a guild
   * @param guildMember
   */
  verifyIsAdmin: (guildMember) => guildMember.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR),

  /**
   * Returns the
   * @param guild
   * @returns {Promise<Role>}
   */
  getModeratorRole: (guild) => new Promise(async (resolve) => {
    // Find this guild's moderator role
    let modRole = null;
    await guild.roles.cache.each((role) => {
      if (modRole !== null) { return; }
      if (role.name === config.moderatorRole) {
        modRole = role;
      }
    });
    resolve(modRole);
  }),

  /**
   * Determine if a user has moderator permissions in a guild
   * @param guildMember
   * @returns {Promise<unknown>}
   */
  verifyModeratorRole: (guildMember) => new Promise(async (resolve) => {
    if (module.exports.verifyIsAdmin(guildMember)) { resolve(true); }
    resolve(await module.exports.getModeratorRole(guildMember.guild).position <= guildMember.roles.highest.position);
  }),

  /**
   * Get an emoji object usable with Discord. Null if the Emoji is not usable in the provided guild.
   * @param guild
   * @param emoji
   * @returns String || Object || null
   */
  parseEmoji: (guild, emoji) => {
    const match = emoji.match(/^<:(.*):(\d+)>$/);
    if (match && match.length > 2) {
      const emojiObj = guild.emojis.resolve(match[2]);
      return emojiObj ? emojiObj : null;
    }

    const nodeEmoji = require('node-emoji');
    return nodeEmoji.hasEmoji(emoji) ? emoji : null;
  },

  cachePartial: (partial) => new Promise((resolve, reject) => {
    if (!partial.hasOwnProperty('partial') || !partial.partial) { resolve(partial); }
    partial.fetch()
      .then((full) => resolve(full))
      .catch((error) => reject(error));
  }),

  parseArgs: (command) => {
    // Quotes with which arguments can be wrapped
    const quotes = [`'`, `"`];

    // State tracking
    let insideQuotes = false;
    let currentQuote = null;

    // Parsed arguments are stored here
    const arguments = [];

    // Break the command into an array of characters
    const commandChars = command.trim().split('');

    let thisArg = "";
    commandChars.forEach((char) => {
      if (char === ' ' && !insideQuotes){
        // This is a whitespace character used to separate arguments
        if (thisArg) { arguments.push(thisArg); }
        thisArg = "";
        return;
      }

      // If this character is a quotation mark
      if (quotes.indexOf(char) > -1) {
        // If the cursor is currently inside a quoted string and has found a matching quote to the
        // quote which started the string
        if (insideQuotes && currentQuote === char) {
          arguments.push(thisArg);
          thisArg = "";
          insideQuotes = false;
          currentQuote = null;
          return;
        }

        // If a quote character is found within a quoted string but it does not match the current enclosing quote,
        // it should be considered part of the argument
        if (insideQuotes) {
          thisArg += char;
          return;
        }

        // Cursor is not inside a quoted string, so we now consider it within one
        insideQuotes = true;
        currentQuote = char;
        return;
      }

      // Include the character in the current argument
      thisArg += char;
    });

    // Append current argument to array if it is populated
    if (thisArg) {arguments.push(thisArg) }

    return arguments;
  },

  registerGuildSlashCommands: async (client) => {
    // Register guild-specific slash commands
    const rest = new REST({ version: 9 }).setToken(config.token);
    const slashCommandFiles = fs.readdirSync('./slashCommands/guild').filter((file) => file.endsWith('.js'));
    for (let commandFile of slashCommandFiles) {
      // Load command file into memory
      const command = require(`./slashCommands/guild/${commandFile}`);

      // Register the slash command with the Discord API
      for (let guild of command.guilds) {
        await rest.put(Routes.applicationGuildCommands(config.clientId, guild),
          { body: [command.data.toJSON()] });
      }

      // Set client to respond to slash commands
      await client.commands.set(command.name, command);
    }
  },

  registerGlobalSlashCommands: async (client) => {
    // Register global slash commands
    const rest = new REST({ version: 9 }).setToken(config.token);
    const slashCommands = [];
    const slashCommandFiles = fs.readdirSync('./slashCommands/global').filter((file) => file.endsWith('.js'));
    slashCommandFiles.forEach((commandFile) => {
      const command = require(`./slashCommands/global/${commandFile}`)
      slashCommands.push(command.data.toJSON());

      // Set client to respond to slash commands
      client.commands.set(command.name, command);
    });
    try{
      await rest.put(Routes.applicationCommands(config.clientId), { body: slashCommands });
    } catch(error) { console.error(error); }
  },
};
