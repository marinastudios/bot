import type { SlashCommandBuilder, CommandInteraction, AutocompleteInteraction } from "discord.js"
import { Mongoose } from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (context: { ctx: CommandInteraction, db: Mongoose, options: { [key: string]: string | number | boolean } }) => void,
}