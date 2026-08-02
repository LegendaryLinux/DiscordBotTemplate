/**
 * Function run when the bot is removed from a guild
 * @param client
 * @param guild
 * @returns {Promise<void>}
 */
module.exports = async (client, guild) => {
  console.log(`Bot has been removed from guild ${guild.name} with id ${guild.id}`);
};
