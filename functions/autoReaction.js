const Discord = require('discord.js');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const serverId = '1053211127330385940';
        const channelIds = ['1175819261873229924', '1175819543071965355', '1178071863532978208', '1165251584255598652'];
        const specialChannelId = '1164999529536426086';

        if (message.guild && message.guild.id === serverId && message.attachments.size > 0) {
            const reactions = channelIds.includes(message.channel.id) ? ['👍', '👎'] :
                              (message.channel.id === specialChannelId) ? ['🤣', '🤮', '🤬'] :
                              [];
            for (let reaction of reactions) {
                try {
                    await message.react(reaction);
                } catch (error) {
                    console.error(`Could not react to the message with ${reaction} emoji:`, error);
                }
            }
        }
    });
};