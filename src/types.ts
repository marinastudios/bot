import type { SlashCommandBuilder, CommandInteraction, AutocompleteInteraction } from "discord.js"
import mongoose, { Model } from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (context: { ctx: CommandInteraction, db: Model<DBApplication>, options: { [key: string]: string | number | boolean } }) => void,
}

export interface DBApplication {
    userId: string,
    fields: { name: string, value: string }[],
    _id: mongoose.Types.ObjectId
}