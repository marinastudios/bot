import {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
  } from "discord.js";
  import { SlashCommand } from "../types";
  
  const interact: SlashCommand = {
    command: new SlashCommandBuilder()
      .setName("list")
      .setDescription("List all applications"),
    execute: async ({ ctx, options, db }) => {
        await ctx.reply({  })
    },
  };
  
  export default interact;
  