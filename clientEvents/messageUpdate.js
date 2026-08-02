const { cachePartial } = require("../lib");

module.exports = async (client, oldMessage, newMessage) => {
  newMessage = await cachePartial(newMessage);
  if (newMessage.member) { newMessage.member = await cachePartial(newMessage.member); }
  if (newMessage.author) { newMessage.author = await cachePartial(newMessage.author); }

  // Do something in response to the message being edited
};