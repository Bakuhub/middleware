import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const recordSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    header: {
        type: Object,

    },
    body: {
        type: Object,

    },
    type: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },


});


export default mongoose.model('record', recordSchema);