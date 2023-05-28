import {
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
    Partials,
    REST,
    Routes,
    Collection,
    ChatInputCommandInteraction,
    ModalSubmitInteraction
} from "discord.js";

import type { DBApplication, SlashCommand } from "./types";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from 'node:path'
import { globby } from "globby";
dotenv.config();


export const appModel = mongoose.model<DBApplication>("app", new mongoose.Schema<DBApplication>({
    userId: String,
    fields: Object,
}));
mongoose.connect(`${process.env.MONGO_URL}`, {
    dbName: 'db'
})

const dirname = path.dirname(import.meta.url.replace("file:///", "/"))
const token = process.env.DISCORD_TOKEN; // Token from Railway Env Variable.
const client_id = process.env.CLIENT_ID;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

client.once(Events.ClientReady, async (c) => {
    console.log(`Logged in as ${c.user.tag}`);
});

const commands = await Promise.all((await globby([`${dirname}/commands/*.ts`, `${dirname}/commands/*.js`])).map(async (v) => (await import(v)).default))

const slashCommands = new Collection<string, SlashCommand>()
commands.forEach((v) => slashCommands.set(v.command.name, v))
const slashCommandsArr: SlashCommandBuilder[] = commands.map((v) => v.command)
const rest = new REST({ version: "10" }).setToken(token);

rest.put(Routes.applicationCommands(client_id), {
    body: slashCommandsArr.map(command => command.toJSON())
}).then((data: any) => {
    console.log(`🔥 Successfully loaded ${data.length} slash command(s)`)
}).catch(e => {
    console.log(e)
});

async function handleCommand(interaction: ChatInputCommandInteraction) {
    const command = slashCommands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    const options: { [key: string]: string | number | boolean } = {};
    for (let i = 0; i < interaction.options.data.length; i++) {
        const element = interaction.options.data[i];
        if (element.name && element.value) options[element.name] = element.value;
    }

    try {
        await command.execute({
            ctx: interaction,
            options,
            db: appModel
        });
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

async function handleModal(interaction: ModalSubmitInteraction) {
    if(interaction.customId !== 'application') return;
    const userId = interaction.user.id;
    const fields = interaction.fields.fields.toJSON().map(v => ({ name: v.customId, value: v.value }))
    await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true })
    await appModel.create({
        userId,
        fields
    })
    await interaction.followUp({ content: 'Your submission was sent to the database!', ephemeral: true })
    await (await interaction.channel.send({ content: '<@954469313052540940>' })).delete()
}

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) return await handleCommand(interaction);
    if (interaction.isModalSubmit()) return await handleModal(interaction);
});


client
    .login(token)
    .catch((error) => console.error("Client Login Error: ", error));