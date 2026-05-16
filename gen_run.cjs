const { writeOutput } = require('./gen_base.cjs');
require('./gen_daily.cjs');
require('./gen_outdoor.cjs');
writeOutput();
console.log('Done!');
