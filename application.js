var _ = require("lodash");
var async = require("async");
var iptables = require([__dirname, "lib", "iptables"].join("/"));
var Rule = require([__dirname, "lib", "rule"].join("/"));

function Tesserarius(){
    this.rules = {};
}

Tesserarius.prototype.add_rule = function(chain, rule_options, fn){
    var self = this;

    if(!_.has(this.rules, chain))
        this.rules[chain] = [];

    rule_options.spec = "append";
    var rule = new Rule(chain, rule_options);

    var rules_by_fingerprint = _.keyBy(this.rules[chain], "fingerprint");

    if(_.has(rules_by_fingerprint, rule.fingerprint)){
        delete rule;
        return fn(new Error("Rule already exists!"));
    }

    rule.execute(function(err){
        if(!err)
            self.rules[chain].push(rule);

        return fn(err);
    });
}

Tesserarius.prototype.delete_rule = function(chain, rule_options, fn){
    var self = this;

    if(!_.has(this.rules, chain))
        this.rules[chain] = [];

    rule_options.spec = "delete";
    var rule = new Rule(chain, rule_options);

    var existing_rule_options = _.clone(rule_options);
    existing_rule_options.spec = "append";
    var existing_rule = new Rule(chain, existing_rule_options);

    rule.execute(function(err){
        var rules_by_fingerprint = _.keyBy(self.rules[chain], "fingerprint");

        if(_.has(rules_by_fingerprint, existing_rule.fingerprint)){
            delete rules_by_fingerprint[existing_rule.fingerprint];
            self.rules[chain] = _.values(rules_by_fingerprint);
        }

        return fn(err);
    });
}

Tesserarius.prototype.set_rules = function(chain, rules, fn){
    var self = this;

    var temp_chain = [];

    var existing_fingerprints = _.keyBy(this.rules[chain], "fingerprint");

    _.each(rules, function(rule_options, fn){
        rule_options.spec = "append";
        var rule = new Rule(chain, rule_options);
        temp_chain.push(rule);
    });

    var new_fingerprints = _.keyBy(temp_chain, "fingerprint");

    var rules_to_add = _.difference(_.keys(new_fingerprints), _.keys(existing_fingerprints));
    var rules_to_remove = _.difference(_.keys(existing_fingerprints), _.keys(new_fingerprints));

    async.parallel([
        function(fn){
            async.each(rules_to_add, function(fingerprint, fn){
                var rule = new_fingerprints[fingerprint];
                self.add_rule(chain, _.clone(rule.options), function(err){
                    return fn();
                });
            }, fn);
        },
        function(fn){
            async.each(rules_to_remove, function(fingerprint, fn){
                var rule = existing_fingerprints[fingerprint];
                self.delete_rule(chain, _.clone(rule.options), function(){
                    return fn();
                });
            }, fn);
        }
    ], fn);
}

Tesserarius.prototype.get_rules = function(chain, fn){
    if(_.isFunction(chain)){
        fn = chain;
        return fn(undefined, this.rules);
    }
    else if(_.has(this.rules, chain))
        return fn(undefined, this.rules[chain]);
    else
        return fn(new Error("Chain has no rules!"));
}

Tesserarius.prototype.create_chain = function(chain, fn){
    iptables.create_chain(chain, fn);
}

Tesserarius.prototype.flush = function(chain, fn){
    iptables.flush(chain, fn);
}

Tesserarius.prototype.set_policy = function(chain, policy, fn){
    iptables.policy(chain, policy, fn);
}

module.exports = Tesserarius;
