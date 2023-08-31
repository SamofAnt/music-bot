const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

async function buttonPages(interaction, pages, index = 0, time = 60000) {
  if (!interaction) throw new Error('Please provide an interation argument');
  if (!pages) throw new Error('Please provide a page argument');
  if (!Array.isArray(pages)) throw new Error('Pages must be an array');

  if (typeof time !== 'number') throw new Error('Time must be a number');
  if (parseInt(time) < 30000)
    throw new Error('Time must be grater than 30 seconds');

  //await interaction.deferReply();

  if (pages.length === 1) {
    const page = await interaction.editReply({
      embeds: pages,
      components: [],
      fetchReply: true,
    });
    return page;
  }

  const prev = new ButtonBuilder()
    .setCustomId('prev')
    .setEmoji('◀️')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);

  const next = new ButtonBuilder()
    .setCustomId('next')
    .setEmoji('▶️')
    .setStyle(ButtonStyle.Primary);

  const back = new ButtonBuilder()
    .setCustomId('back')
    .setEmoji('⏮️')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);
  const skip = new ButtonBuilder()
    .setCustomId('skip')
    .setEmoji('⏭️')
    .setStyle(ButtonStyle.Primary);

  if (index + 1 === pages.length) {
    prev.setDisabled(false);
    back.setDisabled(false);
    next.setDisabled(true);
    skip.setDisabled(true);
  }

  const buttonRow = new ActionRowBuilder().addComponents(
    back,
    prev,
    next,
    skip
  );

  const currentPage = await interaction.editReply({
    embeds: [pages[index]],
    components: [buttonRow],
    fetchReply: true,
  });

  const collector = await currentPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
  });

  collector.on('collect', async (i) => {
    if (i.user.id !== interaction.user.id)
      return i.reply({
        content: 'You cannot use these buttons',
        ephemeral: true,
      });

    await i.deferUpdate();

    if (i.customId === 'prev') {
      if (index > 0) index--;
    } else if (i.customId === 'next') {
      if (index < pages.length - 1) index++;
    }

    if (index === 0) prev.setDisabled(true);
    else prev.setDisabled(false);

    if (index === pages.length - 1) next.setDisabled(true);
    else next.setDisabled(false);

    await currentPage.edit({
      embeds: [pages[index]],
      components: [buttonRow],
    });

    collector.resetTimer();
  });

  collector.on('end', async (i) => {
    await currentPage.edit({
      embeds: [pages[index]],
      components: [],
    });
  });
  return currentPage;
}

module.exports = buttonPages;
