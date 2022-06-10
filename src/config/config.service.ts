import * as fs from 'fs';
import * as dotenv from 'dotenv';

export interface EnvConfig {
    [key: string]: string;
}

export class ConfigService {
    private envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        this.envConfig = config;
    }

    get jwtSecret(): string {
        return this.envConfig.JWT_SECRET;
    }

}
