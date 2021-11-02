const { cachePartial } = require('../lib');

module.exports = async (client, message) => {
  // Fetch message if partial
  message = await cachePartial(message);
  if (message.member) { message.member = await cachePartial(message.member); }
  if (message.author) { message.author = await cachePartial(message.author); }

  // Ignore all bot messages
  if (message.author.bot) { return; }

  if (!message.guild) {
    // Handle DMs to the bot
    return;
  }

  // Handle messages in a guild
};