import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

type MaybePromise<T> = T | Promise<T>

export type ICommandExecute = (interaction: ChatInputCommandInteraction<CacheType>) => MaybePromise<void>

interface IChoices<T> {
    name: string,
    value: T
}

interface IBaseOption {
    name: string,
    description: string,
    required?: boolean
}

interface INumberOption extends IBaseOption {
    type: "Number"
    choices?: IChoices<number>[]
}

interface IBooleanOption extends IBaseOption {
    type: "Boolean"
}

interface IStringOption extends IBaseOption {
    type: "String"
    choices?: IChoices<string>[]
    maxLength?: number
    minLength?: number
}

type IOption = INumberOption | IBooleanOption | IStringOption

interface ICommandProps {
    data: {
        name: string,
        description: string,
        options: IOption[]
    },
    execute: ICommandExecute
}

function isString(option: IOption): option is IStringOption {
    return option.type === "String";
}

function isNumber(option: IOption): option is INumberOption {
    return option.type === "String";
}

function isBoolean(option: IOption): option is IBooleanOption {
    return option.type === "String";
}

export default class Command {
    private _data;
    execute;
    constructor({ data, execute }: ICommandProps) {
        this._data = new SlashCommandBuilder()
            .setName(data.name)
            .setDescription(data.description);

        data.options.map(option => {
            const obj = {
                Number: () => {
                    if (!isNumber(option)) throw new Error("Missmatching type error");
                    this._data
                        .addNumberOption(numberOption => numberOption
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required || false)
                        );
                },
                String: () => {
                    if (!isString(option)) throw new Error("Missmatching type error");
                    this._data
                        .addStringOption(stringOption => {
                            stringOption
                                .setName(option.name)
                                .setDescription(option.description)
                                .setRequired(option.required || false);
                            if (option.maxLength) stringOption.setMaxLength(option.maxLength);
                            if (option.minLength) stringOption.setMinLength(option.minLength);
                            if (option.choices) stringOption.setChoices(...option.choices);
                            return stringOption;
                        });

                },
                Integer: () => {
                    if (!isNumber(option)) throw new Error("Missmatching type error");
                    this._data
                        .addIntegerOption(integerOption => integerOption
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required || false)
                        );
                },
                Boolean: () => {
                    if (!isBoolean(option)) throw new Error("Missmatching type error");
                    this._data
                        .addBooleanOption(booleanOption => booleanOption
                            .setName(option.name)
                            .setDescription(option.description)
                            .setRequired(option.required || false)
                        );
                }
            };
            obj[option.type]();
        }
        );
        this.execute = execute;
    };


    get data() {
        return this._data;
    }


}