const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const quotasSchema = new Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    quotas: {
        type: Number,
        required: true,
        min: 0,
        default: () => 5

    }

})

module.exports = mongoose.model('quotas', quotasSchema);