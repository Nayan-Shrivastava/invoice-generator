const mongoose = require('mongoose');

const id = new mongoose.Schema.Types.ObjectId();

console.log(id.get());
