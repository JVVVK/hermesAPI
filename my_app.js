const addon = require('./build/Release/addon');

const runAddon = () => addon.flpenum(100, 10, 25, 5);

runAddon();