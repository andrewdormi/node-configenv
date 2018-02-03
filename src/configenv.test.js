const ConfigEnv = require('./configenv');

describe('ConfigEnv Test', () => {
    beforeEach(() => {
        process.env.OPTIONTEST = null;
        global.config = null;
    });

    it('Should throw on empty input', () => {
        expect(() => new ConfigEnv()).toThrow();
    });

    it('Should throw on invalid environment', () => {
        expect(() => new ConfigEnv('test')).toThrow();
    });

    it('Should throw on invalid options', () => {
        expect(() => new ConfigEnv({}, 'qwe')).toThrow();
    });

    it('Should throw on null options', () => {
        expect(() => new ConfigEnv({API__PORT: null})).toThrow();
    });

    it('Test parsing default options 0', () => {
        const configEnv = new ConfigEnv({
            OPTION: 'qwe',
            MONGO_URL: 'asd'
        });
        expect(configEnv.config.option).toBe('qwe');
        expect(configEnv.config.mongoUrl).toBe('asd');
    });

    it('Test parsing default options 1', () => {
        const configEnv = new ConfigEnv({
            OPTION: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        });
        expect(configEnv.config.option).toBe('qwe');
        expect(configEnv.config.mongoUrl).toBe('asd');
    });

    it('Test parsing default options 2', () => {
        process.env.OPTIONTEST = 'ert';
        const configEnv = new ConfigEnv({
            OPTIONTEST: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        });
        expect(configEnv.config.optiontest).toBe('ert');
        expect(configEnv.config.mongoUrl).toBe('asd');
    });

    it('Should throw on missed required field', () => {
        expect(() => new ConfigEnv({
            OPTIONTEST: {required: true},
            MONGO_URL: {default: 'asd'}
        })).toThrow();
    });

    it('Should not throw on setting required field', () => {
        process.env.OPTIONTEST = 'ert';
        const configEnv = new ConfigEnv({
            OPTIONTEST: {required: true},
            MONGO_URL: {default: 'asd'}
        });
        expect(configEnv.config.optiontest).toBe('ert');
        expect(configEnv.config.mongoUrl).toBe('asd');
    });

    it('Set global config', () => {
        const configEnv = new ConfigEnv({
            OPTION: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        }, {global: true});
        expect(config.option).toBe('qwe');
        expect(config.mongoUrl).toBe('asd');
    });

    it('Should parse number', () => {
        process.env.OPTIONTEST = '5';
        const configEnv = new ConfigEnv({
            OPTIONTEST: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        }, {parse: true});
        expect(configEnv.config.optiontest).toBe(5);
        expect(configEnv.config.mongoUrl).toBe('asd');
    });

    it('Should correctly parse options', () => {
        const configEnv = new ConfigEnv({
            OPTIONTEST: {default: 'qwe'},
            MONGO_URL: {default: 'asd'},
            API__PORT: {default: 'rty'},
            API__REDIS__PASSWORD: {default: 'password'},
            API__REDIS__LOGIN: {default: 'login'},
            API__REDIS__DB_PREFIX: {default: 'prefix'}
        }, {parse: true});
        expect(configEnv.config.optiontest).toBe('qwe');
        expect(configEnv.config.mongoUrl).toBe('asd');
        expect(configEnv.config.api.port).toBe('rty');
        expect(configEnv.config.api.redis.password).toBe('password');
        expect(configEnv.config.api.redis.login).toBe('login');
        expect(configEnv.config.api.redis.dbPrefix).toBe('prefix');
    });

    it('Should parse invalid format', () => {
        const configEnv = new ConfigEnv({
            API__REDIS__DB_SOME_: {default: 'some'},
            _API__REDIS__DB_SOME2__: {default: 'some2'},
            ______API______REDIS_____DB_SOME3_______: {default: 'some3'},
            __API___reDiS__DB_SOME4__: {default: 'some4'}
        }, {parse: true});

        expect(configEnv.config.api.redis.dbSome).toBe('some');
        expect(configEnv.config.api.redis.dbSome2).toBe('some2');
        expect(configEnv.config.api.redis.dbSome3).toBe('some3');
        expect(configEnv.config.api.redis.dbSome4).toBe('some4');
    });

    it('Should load configuration with env file', () => {
        const configEnv = new ConfigEnv({
            API__PORT: {required: true},
            API__REDIS__PASSWORD: {required: true},
            API__REDIS__LOGIN: {required: true}
        }, {envFile: true});
        expect(configEnv.config.api.port).toBe('rty');
        expect(configEnv.config.api.redis.password).toBe('password');
        expect(configEnv.config.api.redis.login).toBe('login');
    });
});