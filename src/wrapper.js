'use strict';

const Promise = require('bluebird');
const SecretStore = require('./lib/secretstore');
const KMSFLAG = require('./kmsflag');

class Wrapper {
    /**
     *
     * @param KMSOptions KMS Option
     */
    constructor(KMSOptions = {
        region: null,
        table: null,
        kmsKey: 'alias/yadda-secrets',
    }){
        this.options = KMSOptions;

        /**
         * Secret Storage
         * @type {SecretStore|null}
         */
        this.store = null;
    }

    /**
     * Get Secret Storage
     * @return {SecretStore}
     */
    get storage(){
        if(this.store)
            return this.store;

        const { region, table, kmsKey } = this.options;
        if(region && table)
            this.store = new SecretStore({ table, awsOpts: { region }, kmsKey });
        else
            throw new Error('Region & Table are not defined, are you in a Yadda environment?');

        return this.store;
    }

    /**
     * Retrieve from KMS the secret value
     * @private
     * @param value Value to retrieve
     * @return {Promise.<string>}
     */
    retrieveFromKMS(value){
        //Wrap in promise to catch errors calling `this.storage`
        return this.storage.getSecret({ name: value });
    }

    /**
     * Construct KMS config handler from object
     * @param config Config object, or sub config object
     * @return {Proxy}
     */
    KMS_Handler(config){
        return new Proxy(config, this.handler());
    }

    handler() {
        /**
         * Proxy handler
         * @private
         * @type {{get: _handler.get, set: (function(*, *, *): *)}}
         */
        return {
            get: (target, name) => {
                if (!(name in target))
                    return undefined;

                // Handle KMS Variables separately
                if (typeof target[name] === 'object' && target[name].constructor === KMSFLAG) {
                    // If variable is in environment use it instead for backwards comparability
                    if (target[name].name in process.env)
                        return Promise.resolve(process.env[target[name].name]);
                    // If given a resolved variable, resolve to the value directly
                    else if (target[name].resolveTo !== undefined)
                        return Promise.resolve(target[name].resolveTo);
                    else
                        return this.retrieveFromKMS(target[name].name);
                }

                // If a subobject add special handler
                if (typeof target[name] === 'object' && !Array.isArray(target[name]))
                    return this.KMS_Handler(target[name]);

                // Plain property, return it
                return target[name];
            },
            set: (obj, prop, value) => obj[prop] = value
        }
    }
}

module.exports = Wrapper;