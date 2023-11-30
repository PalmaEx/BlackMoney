const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nsfw')
        .setDescription('Sends a random NSFW image.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages) 
        .setDMPermission(false), 

    async execute(client, interaction) {
        if (!interaction.channel.nsfw) {
            return await interaction.reply({ 
                content: 'This command can only be used in NSFW channels.', 
                ephemeral: true 
            });
        }

        try {
                
            const response = await axios.get('https://api.waifu.im/search?included_tags=milf');
            
            if (!response.data || !response.data.images.length) {
                return await interaction.reply({
                    content: 'Failed to retrieve NSFW content.',
                    ephemeral: true
                });
            }

                
            const image = response.data.images[Math.floor(Math.random() * response.data.images.length)];
            const imageUrl = image.url;

            const embed = new EmbedBuilder()
                .setColor('#ff5555')
                .setTitle('NSFW Content')
                .setImage(imageUrl)
                .setFooter({ text: 'NSFW content powered by waifu.im' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching NSFW content:', error);
            await interaction.reply({
                content: 'There was an error trying to fetch NSFW content.',
                ephemeral: true
            });
        }
    },

    options: {
        name: 'nsfw',
        description: 'Sends a random NSFW image.',
    },

    config: {
        enabled: true,
        guildOnly: true,
        nsfw: true
    }
};
