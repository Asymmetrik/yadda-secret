'use strict';

const KMSFLAG = require('./kmsflag');

/**
 * Generate KMS variable facade
 * @param {string} variableName
 * @param {string|null|undefined} autoResolveValue USED FOR TESTING ENVIRONMENTS ONLY
 * @return {KMSFLAG}
 */
module.exports = (variableName, autoResolveValue = undefined) => new KMSFLAG(variableName, autoResolveValue);