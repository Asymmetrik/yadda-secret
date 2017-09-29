'use strict';

const env = require('./env');

/**
 * Generate secret key
 * @param {object|string} options - Given an object it will construct the key from provided options. Given a string the
 *  key will be generated from the yadda environment.
 * @param {string} options.app Application name
 * @param {string} options.region Application region
 * @param {string} options.env Application environment
 * @param {string} options.name Variable name
 * @return {string}
 */
module.exports = function(options = { app: '', region: '', env: '', name: '' }) {
    if(typeof options === 'string')
        return [env.getSecretPrefix() || '', options].join('/');

    const prefix = [options.app, options.region, options.env].map(a => a.toLowerCase()).join('/');

    return prefix.length > 3 ? [prefix, options.name].join('/') : options.name;
};