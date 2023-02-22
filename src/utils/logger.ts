import winston from "winston";

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

export default winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.timestamp(),
                myFormat
            ),
        }),
        new winston.transports.File({ filename: "latest.log" }),
        new winston.transports.File({ filename: "error.log", level: "error" })
    ]
});