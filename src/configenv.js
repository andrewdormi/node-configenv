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

            const keyParts = envKeys[i].toLowerCase().split('__').filter(k => !!k && k !== '_');
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
        const camelCaseProperty = this.formatPropertyToCamelCase(properties[0]);

        if (properties.length === 1) {
            object[camelCaseProperty] = value;
            return;
        }
        object[camelCaseProperty] = object[camelCaseProperty] || {};
        return this.extendObjectWithValue(object[camelCaseProperty], properties.slice(1), value);
    }

    formatPropertyToCamelCase(property) {
        return property.split('_')
            .filter(p => !!p)
            .reduce((acc, cur, i) => i !== 0 ? `${acc}${cur.charAt(0).toUpperCase() + cur.slice(1)}` : cur, '');
    }

    doOptionalActions() {
        if (this.options.global) {
            global.config = this.config;
        }
    }
}

module.exports = ConfigEnv;