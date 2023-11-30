// filename: functions/filterBlacklistedWords.js

const blacklistedWords = [
  'Tocila',
  'tocila',
  'Tocilă',
  'tocilă',
];

module.exports = (client) => {
  client.on('messageCreate', message => {
    if (message.author.bot) return;

    const messageContent = message.content.toLowerCase();
    const containsBlacklistedWord = blacklistedWords.some(word => messageContent.includes(word));

    if (containsBlacklistedWord) {
      message.delete().catch((e) => console.error("Couldn't delete message:", e));
    }
  });
};