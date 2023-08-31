const { QueryType, useHistory } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'emptyQueue',
  execute(bot, queue) {
    const embed = new EmbedBuilder()
      .setColor('#7f0aad')
      .setDescription(`**Больше музыки нет. Идите нахуй**`)
      .setTimestamp();
    return queue.metadata.channel.send({ embeds: [embed] });
  },
};
