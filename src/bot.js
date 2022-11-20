require("dotenv").config()
const { ButtonBuilder } = require("@discordjs/builders");
const { Client, GatewayIntentBits, Partials, EmbedBuilder, Colors, EmbedType, ActionRowBuilder, SelectMenuBuilder, ChannelType, ButtonStyle } = require( "discord.js" );
const mongoose = require("mongoose");
const ticketModel = require("../dara/models/ticket.model");
const bot = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

const slashCommands = require(__dirname + '/handlers/slashCommands.handler')

const {TOKEN, MOGNOOSE_USERNAME, MONGOOSE_USER_PASS} = process.env

slashCommands(bot)
bot.on("ready", async () => {
    console.log("Ready!");   

    mongoose.connect(`mongodb+srv://${MOGNOOSE_USERNAME}:${MONGOOSE_USER_PASS}@botcluster.rqrp4ww.mongodb.net/?retryWrites=true&w=majority`, {  })
        .then(() => console.log("Connected to db!"))
})

// On slash command
bot.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {

        const command = bot.slashCommands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction, bot);
        } catch (error) {
            if (error) console.error(error);
            // await interaction.reply({ 
            //     content: 'There was an error while executing this command!', 
            //     ephemeral: true
            // });
        }

    } else if (interaction.isSelectMenu()) {
        if (interaction.customId === "create-ticket") {
            if (await ticketModel.findOne({ ticketOwnerId: interaction.member.id })) return interaction.reply({ ephemeral: true, content: 'You have active ticket!' })
            const type = interaction.values[0]
            var ticket
            if (type === "ticket-bug") {
                ticket = await ticketModel.create({ ticketOwnerId: interaction.member.id, ticketType: "bug_found" })
            } else if (type === "ticket-help") {
                ticket = await ticketModel.create({ ticketOwnerId: interaction.member.id, ticketType: "code_help" })
            }
            const ticketChannel = await interaction.guild.channels.create({ name: "🎫ticket-" + interaction.member.user.username, type: ChannelType.GuildText })
            await ticketChannel.setParent('1043870126073720903')
            
            const embed = new EmbedBuilder({
                author: {
                    username: bot.user.username,
                    iconURL: bot.user.displayAvatarURL 
                },
                color: Colors.Aqua,
                title: "Ticket Created",
                description: `<@${interaction.author}> to close ticket type click button \`close\`.`,
                footer: {
                    text: "CatSharp Support",
                    icon_url: bot.user.displayAvatarURL
                },
                timestamp: new Date()
            })

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close-ticket-' + ticket._id)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Close!")
                )

            ticketChannel.send({ embeds: [embed], components: [row] })
        }
    } else if (interaction.isButton()) {
        const button = interaction

        if (button.customId.startsWith('close-ticket-')) {
            const id = button.customId.replace('close-ticket-', '')
            const ticket = await ticketModel.findOne({ _id: id })
            await ticket.delete()
            await button.channel.delete()
        }
    }
})

bot.login(TOKEN)