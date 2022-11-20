require('dotenv').config()
const { Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

module.exports = (client) => {

    const cmdFiles = fs.readdirSync(__dirname + "/../slashCommands/").filter(file => file.endsWith(".cmd.js"))

    const commands = []

    client.slashCommands = new Collection()

    for (const file of cmdFiles) {
        const cmd = require(`./../slashCommands/${file}`)
        commands.push(cmd.data.toJSON())
        client.slashCommands.set(cmd.data.name, cmd)
    }

    client.on("ready", () => {

        const CLIENT_ID = client.user.id

        const rest = new REST({
            version: "9"
        }).setToken(process.env.TOKEN);

        (async () => {
            try {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                })
                console.log(`Registered ${commands.length} slash commands!`);
            } catch(err) {
                if(err) console.error(err)
                process.exit()
            }
        })()

    })

}