const { Client, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const { EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { QueryType, useHistory } = require('discord-player');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { TOKEN } = require('./config.json');
const { Player } = require('discord-player');
const Logger = require('./src/modules/logger');
const {
  SpotifyExtractor,
  SoundCloudExtractor,
} = require('@discord-player/extractor');

dotenv.config();

const { YouTubeExtractor } = require('@discord-player/extractor');

// enables youtube extractor

const LOAD_SLASH = process.argv[2] == 'load';

const CLIENT_ID = '1136383876932055071';
const GUILD_ID = '342644026467418113';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.utils = require('./src/modules/utils');
client.logger = Logger;
client.slashcommands = new Discord.Collection();

client.player = new Player(client, {
  connectionTimeout: 0,
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  },
});

client.player.extractors.register(YouTubeExtractor);
client.player.extractors.register(SpotifyExtractor);
client.player.extractors.register(SoundCloudExtractor);

let commands = [];

const slashFiles = fs
  .readdirSync('./src/slash')
  .filter((file) => file.endsWith('.js'));
for (const file of slashFiles) {
  const slashcmd = require(`./src/slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

if (LOAD_SLASH) {
  const rest = new REST({ version: '9' }).setToken(TOKEN);
  console.log('Deploying slash commands');
  rest
    .put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    .then(() => {
      console.log('Successfully loaded');
      process.exit(0);
    });
} else {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    client.user.setActivity({
      name: 'Gachi porn | /help',
      type: Discord.ActivityType.Streaming,
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    });
  });
  client.on('interactionCreate', (interaction) => {
    if (!interaction.isModalSubmit()) {
      async function handleCommand() {
        if (!interaction.isCommand()) return;
        const slashcmd = client.slashcommands.get(interaction.commandName);
        if (!slashcmd) interaction.reply('Not a valid slash command');

        if (slashcmd.data.name !== 'announce') await interaction.deferReply();

        await slashcmd.run({ client, interaction });
      }
      handleCommand();
    } else {
      const { type, customId, channel, guild, user, fields } = interaction;

      console.log(!interaction.isModalSubmit());
      console.log(interaction.fields);
      if (!interaction.isModalSubmit()) return;
      if (!guild || user.bot) return;

      if (customId !== 'announce-modal')
        interaction.deferReply({ ephemeral: true });

      const messageInput = fields.getTextInputValue('messageInput');

      const embed = new EmbedBuilder()
        .setTitle('New Announcement')
        .setDescription(messageInput)
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }
  });

  require('./src/handlers/EventHandler')(client);
  client.login(TOKEN);
}
