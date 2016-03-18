var iptables = require([__dirname, "iptables"].join("/"));
var crypto = require("crypto");

function Rule(chain, options){
    this.chain = chain;
    this.options = options;
    this.fingerprint = crypto.createHash("md5").update(JSON.stringify(this.options)).digest("hex");
}

Rule.prototype.execute = function(fn){
    iptables.add_rule(this.chain, this.options, fn);
}

module.exports = Rule;
