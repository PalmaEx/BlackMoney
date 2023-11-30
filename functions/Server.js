// const { MessageAttachment, MessageEmbed, EmbedBuilder } = require('discord.js');

// async function createOrFetchWebhook(channel, client) {
//         let webhooks = await channel.fetchWebhooks();
//         let webhook = webhooks.find(wh => wh.name === channel.guild.me.displayName);

//         if (!webhook) {
//                 webhook = await channel.createWebhook(channel.guild.me.displayName, {
//                         avatar: client.user.displayAvatarURL()
//                 });
//         }

//         return webhook;
// }

// module.exports = async (client) => {
//         const originalServerId = '1053211127330385940'; 

//         client.on('messageCreate', async (message) => {
//                 if (message.guild.id !== originalServerId || message.webhookId || !message.guild) return;

//                 const embeds = message.embeds.map(embed => new EmbedBuilder(embed));
//                 const attachments = message.attachments.map(a => new MessageAttachment(a.url, a.name));
//                 const backupGuild = client.guilds.cache.get('1176187926808379463');

//                 if (!backupGuild) {
//                         console.log('Backup guild not found');
//                         return;
//                 }

//                 let backupChannelsMap = new Map();
//                 let necessaryChannels = [message.channel.id];

//                 necessaryChannels.forEach(channelId => {
//                         let backupChannel = backupGuild.channels.cache.get(channelId);
//                         if (backupChannel) {
//                                 backupChannelsMap.set(channelId, backupChannel);
//                         }
//                 });

//                 necessaryChannels.forEach(async channelId => {
//                         const backupChannel = backupChannelsMap.get(channelId);

//                         if (!backupChannel) {
//                                 console.log(`No backup channel found for ID ${channelId}`);
//                                 return;
//                         }

//                         const webhook = await createOrFetchWebhook(backupChannel, client);

//                         try {
//                                 await webhook.send({
//                                         content: message.content,
//                                         username: message.author.username,
//                                         avatarURL: message.author.displayAvatarURL(),
//                                         embeds,
//                                         files: attachments
//                                 });
//                         } catch (error) {
//                                 console.error('Error sending message through webhook:', error);
//                         }
//                 });
//         });
// };