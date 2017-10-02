'use strict';

const Promise = require('bluebird');
const Credstash = require('nodecredstash');
const secretGen = require('./secretGen');

class SecretStore {

    /**
     * Interact with the secret credential store
     * @param options - Credential store options (As implemented: https://github.com/DavidTanner/nodecredstash)
     */
    constructor(options){
        if(!options.awsOpts.region)
            throw new Error('AWS Region must be defined');

        this.options = options;
        this.store = new Credstash(options);
        this.cache = {};
    }

    /**
     * Get secret
     * @param name {string} Secret name, case sensitive
     * @param version {number} Secret Version, defaults to newest
     * @param context {*} KMS Context
     * @return {Promise<string>}
     */
    getSecret({ name = null, version = null, context = undefined }){
        return new Promise((resolve, reject) => {
            const key = secretGen(name);

            if(key in this.cache)
                return void resolve(this.cache[key]);

            //Can't return this as it's not interpreted as a promise...
            this.store.getSecret({
                name: key,
                version,
                context
            })
                .then(secret => resolve(this.cache[key] = secret))
                .catch(err => reject(err));
        });
    }
}

module.exports = SecretStore;