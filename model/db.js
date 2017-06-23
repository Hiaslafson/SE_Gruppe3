var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hias:hias1234@ds030500.mlab.com:30500/mtd');