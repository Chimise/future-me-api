export enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test'
}

export interface Config {
    env: Environment;
    port: number;
    db: Database;
    jwt: string;
}

interface Database {
    port: number;
    host: string;
    username: string;
    password: string;

}