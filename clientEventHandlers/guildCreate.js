const config = require('../config.json');
const { getModeratorRole } = require('../lib.js');
const { generalErrorHandler } = require('../errorHandlers');

/**
 * Function run when the bot is added to a guild
 * @param client
 * @param guild
 * @returns {Promise<void>}
 */
module.exports = async (client, guild) => {
  // Create a moderator role for this guild if it does not exist already
  let moderatorRole = await getModeratorRole(guild);
  if (!moderatorRole) {
    await guild.roles.create({
      name: config.moderatorRole,
      reason: `${config.botName} requires a ${config.moderatorRole} role.`
    }).catch((err) => generalErrorHandler(err));
  }
};