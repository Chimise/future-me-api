export enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test'
}

export interface Config {
    isProd: boolean,
    env: Environment;
    port?: number;
    db: Database;
    jwt: string;
    google?: Google
}

export interface Google {
    clientId: string;
    secret: string;
}

interface Database {
    port: number;
    host: string;
    username: string;
    password: string;

}