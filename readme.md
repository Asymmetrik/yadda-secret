## Yadda-Secret

Secret manager for yadda deployments.

## Compatibility

**DO NOT USE ON FRONTEND**

To use this package your node version must support the Proxy object. This is intended
to only run on the **server-side** of the application.

[See if your environment supports Proxies](https://kangax.github.io/compat-table/es6/#test-Proxy)

## Usage

### Configuration

For best ease of use it is recommended to use Yadda as your deployment tool. Otherwise these variables
will need to be defined in the environment in order for this tool to work.

- `__YADDA__DEPLOYMENT_SECRET_TABLE__`: DynamoDB table which holds the secrets
- `__YADDA__DEPLOYMENT_SECRET_TABLE_REGION__`: DynamoDB table region
- `__YADDA__DEPLOYMENT_SECRET_PREFIX__`: The secret key prefix (*AppName/Region/Environment*)
- `__YADDA__DEPLOYMENT_SECRET_KMSALIAS__`: The KMS CMK alias to encrypt and decrypt
- `__YADDA__DEPLOYMENT_SECRET_REGION__`: The region the KMS key resides in (optional)

Developers using this tool will not need access to the CMK but the resulting deployed container will need 
access.

### Usage in configuration files

Usage of Yadda-Secrets is simple enough. From within a configuration file you would pull 
in the KMSVAR and wrap any environment variables to turn them into KMS variables. The variables 
**are** case sensitive.

*Note: KMS variables are lazy evaluated, if you don't use a secret it is not retrieved.*

#### Arrays of KMS values are not supported

```
const { KMSVAR } = require('@asymmetrik/yadda-secret');

module.exports = {
    myCoolApp: 'Hail Hydra',
    
    hydraPassphrase: KMSVAR('HYRDA_PASSPHRASE'),
    hydraSecret: KMSVAR('HYRDA_SECRET'),
};
```

### Usage in Application Framework (Config management)

However you manage to distribute your configuration is irrelevant but the actual object must be wrapped 
with the `KMS_Helper`. Due to the nature of secrets you must keep a hold of the resulting object as 
every invocation of the Yadda-Secret wrapper will result in a new secret cache nothing is stored in the 
yadda-secret module so someone can't attempt to load the module and get access to your secrets in that way.

*This does not protect your AWS keys from being picked up during a NPM install.*

```
const KMSWrapper = require('@asymmetrik/yadda-secret');

module.exports = function(env){
    const config = readConfigFiles();
    
    return KMSWrapper().KMS_Handler(config);
};
``` 

### Usage in Application Controllers (Business Logic)

The resolution order of KMSVAR's are implemented as followed:

`KMSVAR(secret)` -> `process.env[secret]` -> `credentialStore.get(secret)`

Meaning if the variable exists in the environment (not in the store cache) it will return that value 
through a promise. If it is not in the environment it will attempt to get the secret through the credential 
store. It will return the raw payload from the secret store ([Credstash](https://github.com/DavidTanner/nodecredstash))

The business logic code will have to be structured to leverage retrieving the secrets as promises.

```

function BusinessController(app) {
    return { 
        create(req){
            // Pulling a single config variable
            return app.config.hydraPassphrase.then((passphrase) => {
               ... do some logic with it ... 
            });
        }
        
        find(req){
            // Pulling multiple config variables
            return Promise.all([
                app.config.hydraPassphrase,
                app.config.hydraSecret,
            ])
                .then(([passphrase, secret]) => {
                    ... do logic with passphrase and secret ...
                });
        }
    }
}


```

### Usage in Test configs

The preferred option is to keep your configs the same and define the test values in the environment, if your testing
doesn't easily allow for that configuration you're able to pass a second argument to KMSVAR.

The second argument will transform your secret to resolve the given value and not touch the secrets database.

```
const { KMSVAR } = require('@asymmetrik/yadda-secret');

module.exports = {
    myCoolApp: 'Hail Hydra',
    
    hydraPassphrase: KMSVAR('HYRDA_PASSPHRASE', 'secret_phrase'),
    hydraSecret: KMSVAR('HYRDA_SECRET', 'secretive_secret'),
};
```