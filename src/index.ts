import { Events, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import Command from "./classes/Command";
import CommandClient from "./classes/CommandClient";
import * as fs from "fs";
import * as path from "path";
import logger from "./utils/logger";
config();
if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) throw new Error("Token not found");

const files = fs.readdirSync(path.resolve(__dirname, "./commands")).filter(file => file.endsWith(".ts"));

const commands = new Collection<string, InstanceType<typeof Command>>();

async function start() {

    for (const file of files) {
        const { default: command } = await import(`./commands/${file}`) as unknown as { default: Command };
        commands.set(command.data.name, command);
    }
    logger.info("Starting client...");
    const client = new CommandClient({ intents: [GatewayIntentBits.Guilds] }, commands);

    client.once(Events.ClientReady, client => {
        logger.info(`Ready! Logged in as ${client.user.tag}`);
    });

    client.login(process.env.DISCORD_TOKEN);

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            logger.error(err);
        }
    });
}
start();