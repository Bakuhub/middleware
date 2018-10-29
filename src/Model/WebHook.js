import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const webHookSchema = new Schema({
    url: {
        type: String,
        required: true,
        default: '',

    },
    redirectPath: {
        type: String,
        default: ''
    },
    contentType: {
        type: String,
        default: ''
    },
    httpMethod: {
        type: String,
        default: ''
    },

});


export default mongoose.model('webHook', webHookSchema);