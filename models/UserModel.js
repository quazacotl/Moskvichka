const {Schema, model} = require('mongoose')

const UserModel = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false
    },
    appartmentNumber: {
        type: Array,
        required: true,
        default: undefined
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    telegramNick: {
        type: String,
        required: true
    },
    telegramUniqueNick: {
        type: String
    },
    comment: {
        type: String
    }
})

module.exports = model('user', UserModel)