const { cachePartial } = require("../lib");

module.exports = async (client, message) => {
  if (message.member) { message.member = await cachePartial(message.member); }
  if (message.author) { message.author = await cachePartial(message.author); }

  if (!message.guild) {
    // Handle DMs to the bot
    return;
  }

  // Do something with the deleted message
};