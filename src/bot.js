import { config } from "dotenv"
config()
import { Client, GatewayIntentBits, Partials } from "discord.js"
const bot = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
import chalk from 'chalk'

bot.on("ready", () => {
    console.log(chalk.green("Ready!"));   
})

bot.login(process.env.TOKEN)