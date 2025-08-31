import {DevEnvSettings, ProdEnvSettings, StagEnvSettings, TestEnvSettings} from "./env-settings.mjs";
import logger from "../logger/winston-logger.mjs"


export class ConfigValidator {
    static validate(schema, env = process.env) {
        const { error } = schema.validate(env);

        if(error) {
            logger.error(`Config validation error: ${error}`);
            return false;
        }

        return true;
    }

    static getConfig(environment) {
        switch (environment) {
            case "development":
                return DevEnvSettings;
            case "production":
                return ProdEnvSettings;
            case "test":
                return TestEnvSettings;
            case "staging":
                return StagEnvSettings;
        }
    }
}