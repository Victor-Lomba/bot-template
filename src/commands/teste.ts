import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command from "../classes/Command";

async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const msg = interaction.options.get("msg");

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("primary")
                .setLabel("Click me!")
                .setStyle(ButtonStyle.Primary),
        );

    if (!msg || !msg.value || !(typeof msg.value === "string")) {
        await interaction.reply({ content: "invalid arguments", ephemeral: true, components: [row] });
        return;
    }

    await interaction.reply({ content: msg.value, ephemeral: true });
}

export default new Command(
    {
        data: {
            description: "Manda deVolta mensagem",
            name: "ping",
            options: [{ name: "msg", description: "Mensagem para mandar devolta", type: "String", choices: [{ name: "ian", value: "bobo" }, { name: "victor", value: "mais bobo" }] }]
        },
        execute
    }
);