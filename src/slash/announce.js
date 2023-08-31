const { SlashCommandBuilder } = require('@discordjs/builders');

const { QueryType, useHistory } = require('discord-player');
const {
  EmbedBuilder,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Announces a message'),

  run: async ({ client, interaction }) => {
    if (interaction.channel.name === 'announcements') {
      if (!interaction.isChatInputCommand()) return;

      const modal = new ModalBuilder()
        .setCustomId('announce-modal')
        .setTitle('Announcement');

      const messageInput = new TextInputBuilder()
        .setCustomId('messageInput')
        .setLabel('Message')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter the announcment message')
        .setRequired(true);

      const Row = new ActionRowBuilder().addComponents(messageInput);

      modal.addComponents(Row);
      await interaction.showModal(modal);
    }
  },
};
