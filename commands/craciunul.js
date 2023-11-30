const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { version } = require('discord.js');
const os = require('os');

let lastUsageTimestamp = 0;

/*
 * 'Christmas Countdown' Command for Discord Bot
 *
 * Description: Show how many days are left until Christmas
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */

const data = new SlashCommandBuilder()
  .setName('craciunul')
  .setDescription("Coaie cand vine craciunul?");

module.exports.data = data;

module.exports.execute = async (client, interaction) => {
  const now = new Date();

  const timeDifference = now - lastUsageTimestamp;

  if (timeDifference >= 43200000) {
    lastUsageTimestamp = now;

    const christmasDate = new Date(2023, 11, 25);
    const timeUntilChristmas = christmasDate - now;
    const daysUntilChristmas = Math.floor(timeUntilChristmas / (1000 * 60 * 60 * 24));
    const hoursUntilChristmas = Math.floor((timeUntilChristmas % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesUntilChristmas = Math.floor((timeUntilChristmas % (1000 * 60 * 60)) / (1000 * 60));
    const secondsUntilChristmas = Math.floor((timeUntilChristmas % (1000 * 60)) / 1000);

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('Numărătoare inversă pana la Craciun')
      .setImage('https://media.tenor.com/ho-PUjG2TD0AAAAd/happy-new-year-2024.gif')
      .addFields(
        { name: 'Zile :', value: `${daysUntilChristmas} Zile`, inline: true },
        { name: 'Ore :', value: `${hoursUntilChristmas} Ore`, inline: true },
        { name: 'Minute :', value: `${minutesUntilChristmas} Minute`, inline: true },
        { name: 'Secunde :', value: `${secondsUntilChristmas} Secunde`, inline: true },
      );

    return interaction.reply({ embeds: [embed], ephemeral: false });
  } else {
    return interaction.reply("Puteți folosi această comandă din nou în 12 ore.", { ephemeral: true });
  }
};

module.exports.options = {
  ...data.toJSON()
};

module.exports.config = {
  enabled: true,
};
/*
 * 'Christmas Countdown' Command for Discord Bot
 *
 * Description: Show how many days are left until Christmas
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */
