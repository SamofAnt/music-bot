const config = require('../../config.json');
const {
  version,
  time,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Get some info about the bot'),

  run: async ({ client, interaction }) => {
    const format = client.utils.formatNumber;

    const serverCount = format(client.guilds.cache.size);
    const channelCount = format(client.guilds.cache.size);
    const userCount = format(
      client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    );
    const commandCount = format(client.slashcommands.size);

    const createdAt = new Date(client.user.createdAt);
    const uptime = client.utils.formatDuration(
      Math.floor(client.uptime / 1000)
    );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username}’s Info`,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields([
        {
          name: 'General Info',
          value: `Bot Id: ${client.user.id}
Bot Tag: ${client.user.tag}
Created At : ${time(createdAt, 'F')}
Developer: [theevilshot]
Prefix: /`,
        },
        {
          name: 'Bot Stats',
          value: `Users: ${userCount}
Servers: ${serverCount}
Channels: ${channelCount}
Commands: ${commandCount}`,
        },
        {
          name: 'System Info',
          value: `RAM Usage:  ${(
            process.memoryUsage().heapUsed /
            1024 /
            1024
          ).toFixed(2)} MB
Bot Uptime: ${uptime}
Node Version: ${process.version}
Discord.js Version: ${version}
Platform: ${process.platform}`,
        },
      ]);

    const supportButton = new ButtonBuilder()
      .setLabel('Support')
      .setStyle(ButtonStyle.Link)
      .setURL(`${config.supportServerLink}`);

    const inviteButton = new ButtonBuilder()
      .setLabel('Invite')
      .setStyle(ButtonStyle.Link)
      .setURL(`${config.botInviteLink}`);

    const buttonsRow = new ActionRowBuilder().addComponents([
      supportButton,
      inviteButton,
    ]);
    await interaction.editReply({
      ephemeral: true,
      embeds: [embed],
      components: [buttonsRow],
    });
  },
};
