'use strict';

const iptables = require('./iptables');

const crypto = require('crypto');

class Rule {

    constructor(chain, options) {
        this.chain = chain;
        this.options = options;
        this.fingerprint = crypto.createHash('md5').update(JSON.stringify(this.options)).digest('hex');
    }

    execute(callback) {
        iptables.add_rule(this.chain, this.options, callback);
    }

}

module.exports = Rule;
