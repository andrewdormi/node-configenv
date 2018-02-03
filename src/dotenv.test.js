const DotEnv = require('./dotenv');
const path = require('path');

describe('DotEnv test', () => {
    it('Throw on invalid file', () => {
        const dotEnv = new DotEnv();
        expect(() => dotEnv.loadEnvFile('/some/invalid/path')).toThrow();
    });

    it('Throw on empty options', () => {
        const dotEnv = new DotEnv();
        expect(() => {
            dotEnv.parseAndLoadEnv(`API_PORT=`);
        }).toThrow();
    });

    it('Throw on invalid options format', () => {
        const dotEnv = new DotEnv();
        expect(() => {
            dotEnv.parseAndLoadEnv(`API_PORT=qw=e`);
        }).toThrow();
    });

    it('Should load default .env file', () => {
        const dotEnv = new DotEnv();
        expect(() => dotEnv.loadEnvFile());
    });

    it('Should load .env file by path', () => {
        const dotEnv = new DotEnv();
        expect(() => dotEnv.loadEnvFile(path.join(process.cwd(), '.env')));
    });

    it('Should set env variables from .env', () => {
        const dotEnv = new DotEnv();
        dotEnv.loadEnvFile();
        expect(process.env.API__PORT).toBe('rty');
        expect(process.env.API__REDIS__PASSWORD).toBe('password');
        expect(process.env.API__REDIS__LOGIN).toBe('login');
    });

    it('Should throw on double declaration', () => {
        process.env.API__PORT = 'some';
        const dotEnv = new DotEnv();
        expect(() => dotEnv.loadEnvFile()).toThrow();
    });
});