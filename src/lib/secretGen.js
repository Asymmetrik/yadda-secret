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

    let prefix = [options.app, options.region, options.env].map(a => a.toLowerCase()).join('/');
    let length = prefix.length;
    // Don't call join('/') if name is an empty string because then the prefix will be invalid
    // it ends up generating secret's with a name like app/region/env//name
    prefix = options.name ? [prefix, options.name].join('/') : prefix;

    return length > 3 ? modifiedPrefix : options.name;
};