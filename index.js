'use strict';

const Wrapper = require('./src/wrapper');

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
        });

    return {
        /**
         * Return config object that resolves KMS through promises
         * @param config Config object
         * @return {*}
         */
        KMS_Handler(config){ return wrapper.KMS_Handler(config); },

        /**
         * Return config object that has all KMS objects resolved
         * @param config Config object
         * @return {*}
         */
        PreSolve(config){ return wrapper.solve(config); }
    }
};

module.exports.getSecretTable = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_TABLE__ || null };
module.exports.getSecretRegion = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_TABLE_REGION__ || null };
module.exports.getSecretPrefix = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_PREFIX__ || null };
module.exports.getSecretKMSAlias = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_KMSALIAS__ || null };

module.exports.generateSecretKey = require('./src/lib/secretGen');

module.exports.KMSVAR = require('./src/kmsvar');