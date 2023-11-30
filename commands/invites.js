const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invitatii')
        .setDescription("Afișează clasamentul invitațiilor."),

    async execute(client, interaction) {
        const inviteLeaderboardEmbed = await createInviteLeaderboardEmbed(client, interaction.guildId);
        await interaction.reply({ embeds: [inviteLeaderboardEmbed] });
    },

    options: {
        name: 'invites',
        description: "Afișează clasamentul invitațiilor."
    },

    config: {
        enabled: true,
        guildOnly: true
    }
};

async function createInviteLeaderboardEmbed(client, guildId) {
    const guild = await client.guilds.fetch(guildId);
    const invites = await guild.invites.fetch();
    const inviteCount = invites.reduce((acc, invite) => {
        const uses = invite.uses || 0;
        acc[invite.inviter.username] = (acc[invite.inviter.username] || 0) + uses;
        return acc;
    }, {});

    const sortedInviteCounts = Object.entries(inviteCount).sort((a, b) => b[1] - a[1]);
    const top10 = sortedInviteCounts.slice(0, 10);

    const fields = top10.map(([username, count], index) => {
        return { 
            name: `#${index + 1} - ${username}`, 
            value: `Invitații: ${count}`, 
            inline: true 
        };
    });

    return new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('🥇 Clasamentul Invitațiilor 🥇')
        .addFields(fields);
}