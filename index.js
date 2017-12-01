'use strict';

const Wrapper = require('./src/wrapper');
const env = require('./src/lib/env');

/**
 * @param {object} options - Secret options
 * @param {string} options.region - Secret region
 * @param {string} options.table - Secret table (DynamoDB)
 * @param {string} options.kmsKey - KMS Key alias
 * @return {{KMSVAR: (function(*=)), KMS_Handler: *}}
 */
module.exports = (options) => {
    let wrapper = null;
    if(options)
        wrapper = new Wrapper(options);
    else
        wrapper = new Wrapper({
            region: module.exports.getSecretRegion(),
            table: module.exports.getSecretTable(),
            kmsKey: module.exports.getSecretKMSAlias(),
            kmsRegion: module.exports.getSecretKMSRegion()
        });

    return {
        /**
         * Return config object that resolves KMS through promises
         * @param config Config object
         * @return {*}
         */
        KMS_Handler(config){ return wrapper.KMS_Handler(config); },
    }
};

module.exports.getSecretTable = env.getSecretTable;
module.exports.getSecretRegion = env.getSecretRegion;
module.exports.getSecretPrefix = env.getSecretPrefix;
module.exports.getSecretKMSAlias = env.getSecretKMSAlias;
module.exports.getSecretKMSRegion = env.getSecretKMSRegion;

module.exports.generateSecretKey = require('./src/lib/secretGen');

module.exports.KMSVAR = require('./src/kmsvar');