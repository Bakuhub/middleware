import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const webHookSchema = new Schema({
    url: {
        type: String,
        required: true,

    },
    redirectPath: {
        type: String,
        default: ''
    },
    contentType: {
        type: String,
        default: 'application/json',
    },
    httpMethod: {
        type: String,
        default: 'default',
    },
    autoRedirect:{
        type: Boolean,
        default: false,
    },

});


export default mongoose.model('webHook', webHookSchema);