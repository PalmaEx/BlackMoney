const { EmbedBuilder } = require('discord.js');

module.exports = async (client, interaction) => {
    const sendWebhook = async (webhookId, webhookToken, content, embeds) => {
        const webhook = await client.fetchWebhook(webhookId, webhookToken);
        await webhook.send({ content, embeds });
    };

    const sendExecutionLog = async (commandName, userTag, guild, channel, categoryOption) => {
        const guildInfo = guild ? `${guild.name} (${guild.id})` : 'Unknown Server';
        const channelInfo = channel ? `${channel.name} (${channel.id})` : 'Unknown Channel';
        const category = categoryOption || 'None';

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .addFields(
                { name: '🔎 User:', value: `${userTag}`, inline: true },
                { name: '📱 Command:', value: `/${commandName}`, inline: true },
                { name: '📲 Category:', value: `${category}`, inline: true },
                { name: '🏰 Server:', value: guildInfo, inline: true },
                { name: '📌 Channel:', value: channelInfo, inline: true },
            )
            .setTimestamp();

        await sendWebhook('1170162692061929492', '', null, [embed]);
    };

    if (interaction.isCommand()) {
        if (interaction.guildId && interaction.channel && interaction.channel.type === 'GUILD_TEXT') return;

        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return;

        if (cmd.config?.guildOnly && !interaction.guildId) {
            return interaction.reply({
                content: "This command cannot be used outside of a server!",
                ephemeral: true,
            });
        }

        if (cmd.config?.permissions) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member || !member.permissions.has(cmd.config.permissions)) {
                return interaction.reply({
                    content: "You do not have the necessary permissions to use this command!",
                    ephemeral: true,
                });
            }
        }

        try {
            await cmd.execute(client, interaction);
            const category = interaction.options.getString('category') || null;
            await sendWebhook('1170162692061929492', '', `Command used:\nUser: ${interaction.user.tag}\nCommand: ${interaction.commandName}\nSuccessful execution.`);
            await sendExecutionLog(interaction.commandName, interaction.user.tag, interaction.guild, interaction.channel, category);
        } catch (error) {
            console.error(error);
            await sendWebhook('WEHBOOK_ID', 'WEHBOOK_TOKEN', `An error occurred while executing this command | Error: ${error}`);
            await interaction.reply({
                content: "An error occurred while executing this command!",
                ephemeral: true,
            });
        }
    }
};
