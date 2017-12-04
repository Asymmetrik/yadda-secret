'use strict';

module.exports.getSecretTable = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_TABLE__ || null };
module.exports.getSecretRegion = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_TABLE_REGION__ || null };
module.exports.getSecretPrefix = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_PREFIX__ || null };
module.exports.getSecretKMSAlias = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_KMSALIAS__ || null };
module.exports.getSecretKMSRegion = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_REGION__ || process.env.__YADDA__DEPLOYMENT_SECRET_TABLE_REGION__ || null };
module.exports.getSecretCacheBusterKey = function(){ return process.env.__YADDA__DEPLOYMENT_SECRET_CACHE_BUSTER_KEY__ || null };