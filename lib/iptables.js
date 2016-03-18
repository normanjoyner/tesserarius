var _ = require("lodash");
var Joi = require("joi");
var child_process = require("child_process");

var executable = "iptables";

module.exports = {

    create_chain: function(chain, fn){
        if(_.isFunction(chain))
            return fn(new Error("Chain must be defined!"));

        var command = [executable, "-N", chain];

        child_process.exec(command.join(" "), fn);
    },

    flush: function(chain, fn){
        var command = [executable, "-F"];
        if(!_.isFunction(chain))
            command.push(chain);

        child_process.exec(command.join(" "), fn);
    },

    add_rule: function(chain, rule, fn){
        var specs = {
            append: "-A",
            delete: "-D"
        }

        var protocols = [
            "ah",
            "all",
            "esp",
            "icmp",
            "icmpv6",
            "mh",
            "sctp",
            "tcp",
            "udp",
            "udplite"
        ]

        if(_.has(rule, "source_port"))
            rule.source_port = rule.source_port.toString();

        if(_.has(rule, "destination_port"))
            rule.destination_port = rule.destination_port.toString();

        var schema = {
            spec: Joi.string().valid(_.keys(specs)).required(),
            source_port: Joi.string(),
            destination_port: Joi.string(),
            interface: Joi.string(),
            policy: Joi.string().required(),
            protocol: Joi.string().valid(protocols),
            source: Joi.string()
        }

        Joi.validate(rule, schema, function(err){
            if(err)
                return fn(err);

            var command = [
                executable,
                specs[rule.spec],
                chain
            ]

            if(_.has(rule, "interface")){
                command.push("-i");
                command.push(rule.interface);
            }

            if(_.has(rule, "protocol")){
                command.push("-p");
                command.push(rule.protocol);
            }

            if(_.has(rule, "destination_port")){
                command.push("--dport");
                command.push(rule.destination_port);
            }

            if(_.has(rule, "source")){
                command.push("-s");
                command.push(rule.source);
            }

            command.push("-j");
            command.push(rule.policy);

            child_process.exec(this.command.join(" "), fn);
        });
    },

    policy: function(chain, policy, fn){
        if(_.isFunction(chain))
            return fn(new Error("Chain must be defined!"));
        else if(_.isFunction(policy)){
            fn = policy;
            policy = "accept";
        }

        policy = policy.toUpperCase();

        var command = [executable, "-P", chain, policy];

        child_process.exec(command.join(" "), fn);
    }

}
