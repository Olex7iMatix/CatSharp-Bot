const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Sends help!"),
    async execute(interaction, bot) {
        interaction.reply("UwU")
    }
}