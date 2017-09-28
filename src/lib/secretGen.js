'use strict';

/**
 * Generate secret
 * @param {object|string} options
 * @param {string} options.app Application name
 * @param {string} options.region Application region
 * @param {string} options.env Application environment
 * @param {string} options.name Variable name
 * @return {string}
 */
module.exports = function(options = { app: '', region: '', env: '', name: '' }) {
    if(typeof options === 'string')
        return [process.env.__YADDA__DEPLOYMENT_SECRET_PREFIX__ || '', options].join('/');

    const prefix = [app, region, env].map(a => a.toLowerCase()).join('/');

    return prefix.length > 3 ? [prefix, name].join('/') : name;
};