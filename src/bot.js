require("dotenv").config()
const { Client, GatewayIntentBits, Partials } = require( "discord.js" )
const bot = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

const slashCommands = require(__dirname + '/handlers/slashCommands.handler')

slashCommands(bot)
bot.on("ready", () => {
    console.log("Ready!");   
})

bot.login(process.env.TOKEN)