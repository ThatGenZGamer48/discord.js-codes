// The name of the command should be the name of the file
// The file should be stored in ./commands directory.
// Thank you :)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('your-command-name')
        .setDescription('your-command-description')
        .addStringOption((option) =>
            option
                .setName('your-option-name')
                .setDescription('your-option-description')
                .setRequired(true)
        ),
    async execute(interaction) {
        const option1 = interaction.options.getString('your-option-name');
        // your code here
    },
};
