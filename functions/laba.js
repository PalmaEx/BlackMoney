        // Add the following code to the file: functions/laba.js

/**
 * Laba command that checks if the current month is December or not and sends a message accordingly.
 * @param {Client} client - The Discord client instance.
 */
module.exports = (client) => {
  client.on('messageCreate', (message) => {
    if (message.content === '!laba') {
      const currentMonth = new Date().getMonth(); // January is 0, December is 11
      if (currentMonth === 11) {
        message.channel.send('Regula e că în luna Decembrie să nu dai Laba!\n# Pune o pe aia mica in pantaloni!');
      } else {
        message.channel.send('Spor la laba baa!');
      }
    }
  });
};