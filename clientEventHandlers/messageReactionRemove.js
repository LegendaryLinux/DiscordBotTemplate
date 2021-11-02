const { parseEmoji, cachePartial } = require('../lib');

module.exports = async (client, messageReaction, user) => {
  // Fetch partials if necessary
  messageReaction = await cachePartial(messageReaction);
  messageReaction.message = await cachePartial(messageReaction.message);

  // Do nothing if the user is a bot or the message is a DM
  if (user.bot || !messageReaction.message.guild) { return; }

  // Grab the guild this reaction is a part of
  const guild = messageReaction.message.guild;

  const emoji = parseEmoji(guild, messageReaction.emoji.toString());
  if (!emoji) {
    // Emoji is not usable by this guild
  }
};
