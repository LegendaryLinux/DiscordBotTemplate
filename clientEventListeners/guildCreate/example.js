/**
 * Function run when the bot is added to a guild
 * @param client
 * @param guild
 * @returns {Promise<void>}
 */
module.exports = async (client, guild) => {
  console.log(`Bot has joined guild ${guild.name} with id ${guild.id}`);
};
