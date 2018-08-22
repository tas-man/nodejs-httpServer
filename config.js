/*
 *  Configuration variables
 *
 */
 var env = {};

 env.staging = {
   'httpPort' : 3000,
   'envName' : 'staging'
 };

env.production = {
  'httpPort' : 4000,
  'envName' : 'production'
};
// Determine env specified by user
var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// Default to statging env
var envToExport = typeof(env[currentEnv]) == 'object' ? env[currentEnv] : env.staging;

module.exports = envToExport;
