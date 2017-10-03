'use strict';

class KMSFLAG {
    /**
     * Variable to pull from KMS
     * @param name
     * @param resolveTo
     */
    constructor(name, resolveTo = undefined){
        this.name = name;
        this.resolveTo = resolveTo;
    }
}

module.exports = KMSFLAG;