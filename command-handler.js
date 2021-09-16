const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
// I imported the clientId, guildId, token from "utils.js" file but you can import it from config.json files too!
// Guild Id is where you want the slash commands to be registered!
const { clientId, guildId, token } = require("./utils");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

// Registering the client
client = new Client({
	intents: [
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_MESSAGES,
	],
	allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

// Command Handler
client.commands = new Collection();

const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Slash Command Builder (Handler)
const commands = [];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	console.log(
		"[SLASH CMD] Loaded " + String(file) + " slash command successfully!"
	);
}

// Registering Slash Commands from file
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
	try {
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: commands,
		});

		console.log("Successfully registered application commands.");
	} catch (error) {
		console.error(error);
	}
})();

// Events:
// Ready
client.once("ready", () => {
	console.log("Bot is ready!");
});

// On Message Create Event
client.on("messageCreate", async (message) => {
	if (message.content == `<@${client.user.id}>`) {
		await message.channel.send('My prefix is "/", I use slash command.');
	}
});

// On Interaction Create Event
client.on("interactionCreate", async (inter) => {
	if (inter.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
});

client.login(token);
