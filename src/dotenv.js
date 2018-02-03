const path = require('path');
const fs = require('fs');

class DotEnv {
    loadEnvFile(envFilePath) {
        if (typeof(envFilePath) !== 'string') {
            envFilePath = path.join(process.cwd(), '.env');
        }

        try {
            const file = fs.readFileSync(envFilePath, {encoding: 'utf8', flag: 'r'});
            this.parseAndLoadEnv(file);
        } catch (err) {
            throw new Error(`Cannot load env file from ${envFilePath} ${err}`);
        }
    }

    parseAndLoadEnv(file) {
        const lines = file.split('\n').filter(l => !!l);

        for (let i = 0; i < lines.length; i++) {
            const slice = lines[i].split('=').map(opt => opt.trim());
            if (slice.length !== 2) {
                throw new Error(`Invalid .env file format (should have only one = in line)`);
            }

            const envKey = slice[0];
            const envValue = slice[1];

            if (!envValue) {
                throw new Error(`Empty declaration for key: ${envValue}`);
            }
            if (process.env[envKey]) {
                throw new Error(`Double declaration of environment for key: ${envKey}`);
            }

            process.env[envKey] = envValue;
        }
    }
}

module.exports = DotEnv;