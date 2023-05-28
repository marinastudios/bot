import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  APIEmbedField,
} from "discord.js";
import { DBApplication, SlashCommand } from "../types";

const interact: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("list")
    .setDescription("List all applications"),
  execute: async ({ ctx, options, db }) => {
    async function toEmbed(obj: DBApplication): Promise<EmbedBuilder> | never {
      if (!ctx.guild.available)
        throw ctx.reply({ content: "Unable to fetch guild." });
      const user = await ctx.guild.members.fetch({
        user: obj.userId,
        force: true,
      });
      const fields = Object.entries(obj.fields).map((v) => {
        return {
          ...v[1],
          inline: true
        }
      })
      return new EmbedBuilder()
        .setTitle(`Application #${obj._id.toString()}`)
        .setAuthor({
          name: `${user.user.username} (${user.user.discriminator})`,
          iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.user.avatar}.png`,
        })
        .setFields(
          ...fields
        );
    }
    ctx.reply({
      content: "# Applications",
      embeds: await Promise.all(
        (await db.find({})).map(async (v) => (await toEmbed(v)).toJSON())
      ),
    });
  },
};

export default interact;
