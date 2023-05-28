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
    .setName("apply")
    .setDescription("Apply for an application"),
  execute: async ({ ctx, options }) => {
    const modal = new ModalBuilder()
      .setTitle("Marina Studios Team Application")
      .setCustomId("application");
    const fields = [
      new TextInputBuilder()
        .setCustomId("whyJoin")
        .setLabel("Why do you think you should join?")
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("whoGave")
        .setLabel("How did you find out about Marina Studios?")
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("github")
        .setLabel("Provide your GitHub username: ")
        .setStyle(TextInputStyle.Short),
    ].map((v) => new ActionRowBuilder().setComponents(v));
    // @ts-ignore
    modal.addComponents(...fields);
    await ctx.showModal(modal);
  },
};

export default interact;
