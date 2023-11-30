const Discord = require('discord.js');
/*
 * 'Invoiti' Command for Discord Bot
 *
 * Description: No.
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const staffChannelId = '1176181322696380457'; 
        const adminChannelId = '1176181722044444764'; 

        if (message.channel.id === staffChannelId && !message.author.bot) {
            const adminChannel = await client.channels.fetch(adminChannelId);

            const embed = new Discord.Embed({
                title: "Notificare de Învoire",
                fields: [
                    {
                        name: "Membru Staff",
                        value: `${message.author.tag}`,
                        inline: true
                    },
                    {
                        name: "Mesaj",
                        value: message.content
                    }
                ],
                timestamp: new Date(),
                color: 0x0099ff 
            });

            try {
                const sentMessage = await adminChannel.send({ embeds: [embed] });
                const replyMessage = await message.reply('Cererea ta de învoire a fost trimisă către administratori.');
                await sentMessage.react('👍');
                await sentMessage.react('👎');

                const filter = (reaction, user) => {
                    return (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') && !user.bot;
                };

                const collector = sentMessage.createReactionCollector({ filter, time: 86400000 });

                collector.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name === '👍') {
                        await replyMessage.edit('Cererea ta de învoire a fost acceptată de către #' + user.tag);
                    } else if (reaction.emoji.name === '👎') {
                        await replyMessage.edit('Cererea ta de învoire a fost respinsă de către #' + user.tag);
                    }
                });

            } catch (error) {
                console.error("Error sending message to the admin channel: ", error);
            }
        }
    });
};
/*
 * 'Invoiti' Command for Discord Bot
 *
 * Description: No.
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */
