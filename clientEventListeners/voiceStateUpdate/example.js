module.exports = async (client, oldState, newState) => {
  // If the user changed their voice state but remained in the same channel, do nothing (mute, deafen, etc.)
  if (oldState.channel && newState.channel && oldState.channel.id === newState.channel.id) {
    return;
  }

  // User entered a voice channel
  if (newState.channel) {
    // Do something
  }

  // User left a voice channel
  if (oldState.channel) {
    // Do something
  }
};
