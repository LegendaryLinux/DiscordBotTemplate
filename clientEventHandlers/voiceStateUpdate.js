const { generalErrorHandler } = require('../errorHandlers');
const { cachePartial } = require('../lib');

module.exports = async (client, oldState, newState) => {
  // Fetch partials if necessary
  oldState.member = await cachePartial(oldState.member);
  newState.member = await cachePartial(newState.member);

  // If the user changed their voice state but remained in the same channel, do nothing (mute, deafen, etc.)
  if (oldState.channel && newState.channel && oldState.channel.id === newState.channel.id) { return; }

  // User entered a voice channel
  if (newState.channel) {}

  // User left a voice channel
  if (oldState.channel) {}

  // User left a voice channel and did not enter a new one
  if (newState.channel && !oldState.channel) {}
};