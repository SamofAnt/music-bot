const { QueryType, useHistory } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const delayInMilliseconds = 5000;

module.exports = {
  name: 'emptyChannel',
  execute(bot, queue) {
    const embed = new EmbedBuilder()
      .setColor('#7f0aad')
      .setDescription(`**Все ушли. Поэтому я по съебам.**`);
    setTimeout(() => {
      bot.destroy();
      return queue.metadata.channel.send({ embeds: [embed] });
    }, delayInMilliseconds);
  },
};
