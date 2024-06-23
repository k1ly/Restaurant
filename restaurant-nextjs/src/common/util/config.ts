export enum ConfigKey {
    ApiUrl = "API_URL",
}

export class Config {
    private config: Record<ConfigKey, string> = {
        [ConfigKey.ApiUrl]: "http://localhost:3000",
    };

    get = (key: ConfigKey) => this.config[key];
}

const config = new Config();

export default config;
