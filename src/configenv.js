class ConfigEnv {
    constructor(environment, options = {}) {
        this.validateEnvironmentOption(environment);
        this.validateConfigOptions(options);

        this.options = options;
        this.config = this.parseEnvironment(environment);

        this.doOptionalActions();
    }

    validateConfigOptions(options) {
        if (options && typeof(options) !== 'object') {
            throw new Error('Invalid configuration options');
        }
    }

    validateEnvironmentOption(environment) {
        if (!environment) {
            throw new Error('Missing environment option');
        }

        if (typeof(environment) !== 'object') {
            throw new Error('Environment option need to be object');
        }
    }

    parseEnvironment(environment) {
        const envKeys = Object.keys(environment);
        const config = {};
        for (let i = 0; i < envKeys.length; i++) {
            let option = environment[envKeys[i]];
            if (!option) {
                throw new Error(`Invalid configuration for ${envKeys[i]} key`);
            }

            if (typeof(option) !== 'object') {
                option = {default: option};
            }

            const keyParts = envKeys[i].toLowerCase().split('_');
            const value = this.resolveOptionValue(envKeys[i], option);
            this.extendObjectWithValue(config, keyParts, value);
        }
        return config;
    }

    resolveOptionValue(envKey, option) {
        let processValue = process.env[envKey];
        if (this.options.parse) {
            try {
                processValue = JSON.parse(processValue);
            } catch (err) {
            }
        }

        const defaultOption = processValue || option.default;
        if (!defaultOption && option.required) {
            throw new Error(`Missing required configuration on key ${envKey}`);
        }

        return defaultOption;
    }


    extendObjectWithValue(object, properties, value) {
        if (properties.length === 1) {
            object[properties[0]] = value;
            return;
        }

        object[properties[0]] = object[properties[0]] || {};
        return this.extendObjectWithValue(object[properties[0]], properties.slice(1), value);
    }

    doOptionalActions() {
        if (this.options.global) {
            global.config = this.config;
        }
    }
}

module.exports = ConfigEnv;