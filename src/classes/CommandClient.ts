import { Client, ClientOptions, Collection, REST, Routes } from "discord.js";
import logger from "../utils/logger";
import Command from "./Command";


export default class CommandClient extends Client {
    commands;
    constructor(options: ClientOptions, commands: Collection<string, InstanceType<typeof Command>>) {
        super(options);
        this.commands = commands;

        const sendSlashCommands = async () => {
            try {
                if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_TOKEN) return;

                const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
                const data = await rest.put(
                    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                    { body: this.commands.map(item => item.data) },
                ) as unknown[];
                logger.info(data);
                logger.info(`Successfully reloaded ${data.length} application (/) commands.`);

            } catch (err) {
                logger.error(`Error reloading application (/) commands.${err}`);
            }
        };
        sendSlashCommands();
    }
}