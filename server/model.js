const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Code = mongoose.model('Code', CodeSchema);

module.exports = Code;
