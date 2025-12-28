import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: string;
}

const loadEnvironmentVariables = () : EnvConfig => {
    const requiredEnvVars: string[] = ["PORT", "DB_URL", "NODE_ENV"];

    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    })
    return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as string
}
}

export const envVars = loadEnvironmentVariables();