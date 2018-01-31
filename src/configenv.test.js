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

    it('Test parsing default options 0', () => {
        const configEnv = new ConfigEnv({
            OPTION: 'qwe',
            MONGO_URL: 'asd'
        });
        expect(configEnv.config.option).toBe('qwe');
        expect(configEnv.config.mongo.url).toBe('asd');
    });

    it('Test parsing default options 1', () => {
        const configEnv = new ConfigEnv({
            OPTION: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        });
        expect(configEnv.config.option).toBe('qwe');
        expect(configEnv.config.mongo.url).toBe('asd');
    });

    it('Test parsing default options 2', () => {
        process.env.OPTIONTEST = 'ert';
        const configEnv = new ConfigEnv({
            OPTIONTEST: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        });
        expect(configEnv.config.optiontest).toBe('ert');
        expect(configEnv.config.mongo.url).toBe('asd');
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
        expect(configEnv.config.mongo.url).toBe('asd');
    });

    it('Set global config', () => {
        const configEnv = new ConfigEnv({
            OPTION: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        }, {global: true});
        expect(config.option).toBe('qwe');
        expect(config.mongo.url).toBe('asd');
    });

    it('Should parse number', () => {
        process.env.OPTIONTEST = '5';
        const configEnv = new ConfigEnv({
            OPTIONTEST: {default: 'qwe'},
            MONGO_URL: {default: 'asd'}
        }, {parse: true});
        expect(configEnv.config.optiontest).toBe(5);
        expect(configEnv.config.mongo.url).toBe('asd');
    });
});