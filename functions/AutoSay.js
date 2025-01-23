module.exports = (client) => {
  const { EmbedBuilder } = require('discord.js');

  client.on('messageCreate', message => {
    if (message.channel.nsfw && message.content === '!disclamer') {
      // Use try-catch for handling asynchronous errors instead of chaining then() and catch()
      const embed = new EmbedBuilder()
        .setColor(0xFFA07A)
        .setTitle('Atentie Continut 18+!!')
        .setDescription('> Postarile pot contine continut 18+\n\n, **__NOI SI DISCORD NU NE ASUMAM ACEST LUCRU CAT TIMP NU CONTINE SPIONAJ SAU VIOLURI__**\n Imaginile nu trebuie sa contina Pornografie infantila, Videoclip-uri "Promo" adica cele care contine link-uri de discord!')
        .setImage('https://www.allbusiness.com/media-library/triangular-yellow-warning-sign-with-a-red-border-with-an-exclamation-mark-and-the-text-disclaimer.jpg?id=32091372&width=400&height=400')
        .setTimestamp();

      message.channel.send({ embeds: [embed] }).catch(console.error);

      // Try to delete the message after sending the embed
      message.delete().catch(err => {
        if (err.code === 10008) {
          console.error('Error: Unknown Message. It might have already been deleted.');
        } else {
          console.error(err);
        }
      });
    }
  });
};
