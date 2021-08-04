const moment = require('moment');

//const start = moment().startOf('week');
const start = moment('DD');
const end = moment().endOf('week');

console.log(start.toString());
console.log(end.toString());

//for code testing purposes
