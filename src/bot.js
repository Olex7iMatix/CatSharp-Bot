require("dotenv").config()
const { Client, GatewayIntentBits, Partials } = require( "discord.js" );
const mongoose = require("mongoose");
const bot = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });

const slashCommands = require(__dirname + '/handlers/slashCommands.handler')

const {TOKEN, MOGNOOSE_USERNAME, MONGOOSE_USER_PASS} = process.env

slashCommands(bot)
bot.on("ready", () => {
    console.log("Ready!");   

    mongoose.connect(`mongodb+srv://${MOGNOOSE_USERNAME}:${MONGOOSE_USER_PASS}@botcluster.rqrp4ww.mongodb.net/?retryWrites=true&w=majority`, {  })
        .then(() => console.log("Connected to db!"))
})

bot.login(TOKEN)