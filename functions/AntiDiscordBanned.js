const { WebhookClient, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const fetch = require('node-fetch');
const ffmpeg = require('ffmpeg');

/*
 * 'Anti discord Ban' Command for Discord Bot
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
        if (!message.author.bot && message.attachments.size > 0) {
            const channelsToMonitor = ['1172265188678959174', '1164299459723800696', '1164999529536426086'].filter(Boolean);

            if (channelsToMonitor.includes(message.channelId)) {
                let webhookClient;
                try {
                    webhookClient = await message.channel.createWebhook({
                        name: message.author.username,
                        avatar: message.author.displayAvatarURL(),
                    });

                    for (const [, attachment] of message.attachments) {
                        const supportedExtensions = ['mp4', 'mkv', 'webm', 'avi', 'gif', 'png', 'jpg', 'jpeg'];
                        const extension = attachment.name.split('.').pop().toLowerCase();

                        if (!supportedExtensions.includes(extension)) {
                            continue;
                        }

                        const response = await fetch(attachment.url);
                        const contentType = response.headers.get('content-type');

                        if (!contentType || !supportedExtensions.includes(contentType.split('/')[1])) {
                            continue;
                        }

                        if (contentType.startsWith('image/')) {
                            await processImage(message, attachment, webhookClient, contentType);
                        } else if (contentType.startsWith('video/')) {
                            await processVideo(message, attachment, webhookClient);
                        }
                    }

                    await message.delete();
                } catch (error) {
                    console.error('Error sending message via webhook:', error);

                    if (error.message && error.message.includes('Payload size is too large')) {
                        await message.channel.send('Error: Too many files. Please reduce the number of attachments.');
                    }
                } finally {
                    if (webhookClient) {
                        await webhookClient.delete().catch(console.error);
                    }
                }
            }
        }
    });
};
/*
 * 'Anti discord Ban' Command for Discord Bot
 *
 * Description: No.
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */

async function processImage(message, attachment, webhookClient, contentType) {
    const canvas = Canvas.createCanvas(attachment.width || 500, attachment.height || 500);
    const context = canvas.getContext('2d');

    const text = 'Black Money';
    const subText = 'discord.gg/BlackMoney';

    const background = await Canvas.loadImage(attachment.url);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    context.fillRect(0, (canvas.height / 2) - 30, canvas.width, 60);
    context.font = '28px sans-serif';
    context.textAlign = 'center';
    context.fillStyle = '#ffffff';

    context.fillText(text, canvas.width / 2, canvas.height / 2 - 5);
    context.font = '20px sans-serif';
    context.fillText(subText, canvas.width / 2, canvas.height / 2 + 20);

    const finalAttachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: `watermarked-${attachment.name}`,
    });

    await sendAttachment(message, finalAttachment, webhookClient);
}
async function processVideo(message, attachment, webhookClient) {
    const finalAttachment = new AttachmentBuilder(attachment.url, {
        name: attachment.name,
    });

    await sendAttachment(message, finalAttachment, webhookClient);
}

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
async function sendAttachment(message, attachment, webhookClient) {
    const embed = new EmbedBuilder()
        .setColor(0x00AE86)
        .setDescription(message.content ? message.content : '\u200B')
        .setFooter({ text: `Message from ${message.author.tag}` });

    if (attachment.name.endsWith('.gif')) {
        embed.setImage(`attachment://${attachment.name}`);
    }
/*
 * 'Anti discord Ban' Command for Discord Bot
 *
 * Description: No.
 * Author: Hubyp#2814 & 948916911293497344
 * Copyright © 2023 Palma Team
 *
 * For more information or to report issues, please refer to the README.md and LICENSE files.
 * You can also contact us at Hubyp#2814 & 948916911293497344.
 *
 */

    await webhookClient.send({
        content: message.reference ? `<@${message.author.id}>` : undefined,
        files: [attachment],
        embeds: [embed],
    });
}
