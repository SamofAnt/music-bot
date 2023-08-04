const { Client, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');

const { joinVoiceChannel } = require('@discordjs/voice');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const { Player } = require('discord-player');

const {
  SpotifyExtractor,
  SoundCloudExtractor,
} = require('@discord-player/extractor');

dotenv.config();
const TOKEN = process.env.TOKEN;

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
  .readdirSync('./slash')
  .filter((file) => file.endsWith('.js'));
for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`);
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
  });
  client.on('interactionCreate', (interaction) => {
    async function handleCommand() {
      if (!interaction.isCommand()) return;
      const slashcmd = client.slashcommands.get(interaction.commandName);
      if (!slashcmd) interaction.reply('Not a valid slash command');

      await interaction.deferReply();
      await slashcmd.run({ client, interaction });
    }
    handleCommand();
  });
  client.login(TOKEN);
}
