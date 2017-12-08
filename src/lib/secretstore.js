'use strict';

const Promise = require('bluebird');
const Credstash = require('nodecredstash');
const secretGen = require('./secretGen');
const AWS = require('aws-sdk');

class SecretStore {

    /**
     * Interact with the secret credential store
     * @param options - Credential store options (As implemented: https://github.com/DavidTanner/nodecredstash)
     */
    constructor(options){
        if(!options.awsOpts.region)
            throw new Error('AWS Region must be defined');

        // check the cache buster key every minute
        if(options.cacheBuster){
            console.log('cacheBuster: ' + options.cacheBuster);
            const dynamoDB = new AWS.DynamoDB.DocumentClient({
                region: options.awsOpts.region
            });
            const params = {
                TableName: options.table,
                ConsistentRead: true,
                Key: {
                    name: ':name'
                },
                AttributesToGet: ['contents']
                ExpressionAttributeValues: {
                    ':name': secretGen(options.cacheBuster)
                }
            }
            setInterval(() => {
                console.log(this.cacheRefreshTime);
                dynamoDB.get(params, (err, obj) => {
                    console.log(err, obj);
                    if(err)
                        return void console.error(err);
                    this.cacheRefreshTime = Number(obj.Item.contents);
                });
            }, 5000).unref();
            delete options.cacheBuster;
        }

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

            if(key in this.cache){
                // doing a less than comparison for a time to a null/undefined value will be false
                if(this.cache[key].timestamp < this.cacheRefreshTime)
                    delete this.cache[key];
                else
                    return void resolve(this.cache[key].value);
            }

            //Can't return this as it's not interpreted as a promise...
            const timestamp = Date.now();
            this.store.getSecret({
                name: key,
                version,
                context
            })
                .then((secret) => {
                    this.cache[key] = {
                        timestamp: timestamp,
                        value: secret
                    };
                    resolve(secret);
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = SecretStore;