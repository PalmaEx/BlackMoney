const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infobot')
        .setDescription("Show general information about the bot."),

    async execute(client, interaction) {
        const pingEmbed = createInfoEmbed(client);
        await interaction.reply({ embeds: [pingEmbed], ephemeral: false });
    },

    options: {
        name: 'infobot',
        description: "Show general information about the bot."
    },

    config: {
        enabled: true,
        guildOnly: true
    }
};

function createInfoEmbed(client) {
    const { version } = require('discord.js');
    return new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Bot info')
        .addFields(
            { name: 'Ping:', value: `${Math.floor(client.ws.ping)}ms`, inline: true },
            { name: 'Uptime:', value: formatUptime(client.uptime), inline: true },
            { name: 'Version Discord.js', value: `v${version}`, inline: true },
            { name: 'Version Node.js', value: process.version, inline: true },
            { name: 'Fondator', value: '<@948916911293497344>', inline: true },
            { name: 'All channels', value: client.channels.cache.size.toString(), inline: true },
            { name: 'All Servers', value: client.guilds.cache.size.toString(), inline: true }
        );
}

function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}