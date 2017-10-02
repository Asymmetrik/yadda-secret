'use strict';

const KMSFLAG = require('./kmsflag');

/**
 * Generate KMS variable facade
 * @param variableName
 * @return {KMSFLAG}
 */
module.exports = (variableName) => new KMSFLAG(variableName);