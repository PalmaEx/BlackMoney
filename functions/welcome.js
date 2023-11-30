const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Canvas = require('canvas');

async function createCustomImage(member) {
  const canvasWidth = 1024;
  const canvasHeight = 500; 
  const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
  const context = canvas.getContext('2d');

  const avatarSize = 256; 
  const avatarX = 50; 
  const avatarY = (canvasHeight - avatarSize) / 2;

  try {
    const background = await Canvas.loadImage('./1.jpg');
    context.filter = 'blur(100px)';
    context.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    context.filter = 'none';

    const avatarURL = member.displayAvatarURL({ extension: 'png', size: 1024 });
    const avatar = await Canvas.loadImage(avatarURL);
    context.save();
    context.beginPath();
    context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.filter = 'blur(5px)';
    context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    context.restore();

    const nameText = member.displayName;
    const additionalText = 'Bine ai venit pe server!';
    const textX = canvasWidth - 50; 
    context.font = '40px sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign = 'right';
    context.fillText(nameText, textX, canvasHeight / 2 + 10); 

    context.font = '40px sans-serif';
    context.fillStyle = '#fffb00';
    context.fillText(additionalText, textX, canvasHeight / 2 + 40); 

    return new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome-image.png' });

  } catch (error) {
    console.error('Error creating custom image:', error);
    return null;
  }
}

async function createWelcomeEmbed(member) {
  let welcomeEmbed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('Bun venit în comunitate!')
    .setDescription(`- Salut ${member.displayName}, suntem încântați să te avem aici!\n Nu uita sa intri si pe <#1164299459723800696> SA DAI SI TU O LABA!`)
   // .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
  
  const welcomeImage = await createCustomImage(member);
  if (!welcomeImage) {
    welcomeEmbed.setDescription(`Salut ${member.displayName}, suntem încântați să te avem aici! Din păcate, nu am putut crea o imagine personalizată.`);
    return { embeds: [welcomeEmbed] }; 
  }
  welcomeEmbed.setImage(`attachment://${welcomeImage.name}`);

  return { embeds: [welcomeEmbed], files: [welcomeImage] };
}

async function createBoostEmbed(member) {
  let boostEmbed = new EmbedBuilder()
    .setColor('#ff73fa')
    .setTitle('Mulțumim pentru Boost! 🚀')
    .setDescription(`${member.displayName}, ești incredibil! Mulțumim că ai ales să ne susții.`)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'Nume utilizator', value: `${member.user.tag}` },
      { name: 'Server Boost Level', value: `${member.guild.premiumTier}` }
    )
    .setTimestamp();

  const boostImage = await createCustomImage(member);
  if (!boostImage) {
    boostEmbed.setDescription(`${member.displayName}, ești incredibil! Mulțumim că ai ales să ne susții. Din păcate, nu am putut crea o imagine personalizată.`);
    return { embeds: [boostEmbed] }; 
  }
  boostEmbed.setImage(`attachment://${boostImage.name}`);

  return { embeds: [boostEmbed], files: [boostImage] };
}

module.exports = (client) => {
  const welcomeChannelId = '1176265302527447040'; 
  const boostChannelId = '1164281635584348252'; 
  
  client.on('guildMemberAdd', async (member) => {
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
    if (!welcomeChannel) return;
    
    const welcomeMessage = await createWelcomeEmbed(member);
    welcomeChannel.send(welcomeMessage).catch(console.error); // Handle promise rejections
  });

  client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const boostChannel = newMember.guild.channels.cache.get(boostChannelId);
    if (!boostChannel) return;

    if (!oldMember.premiumSince && newMember.premiumSince) {
      const boostMessage = await createBoostEmbed(newMember);
      boostChannel.send(boostMessage).catch(console.error); // Handle promise rejections
    }
  });
};