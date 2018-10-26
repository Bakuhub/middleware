import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const webHookSchema = new Schema({
    url: {
        type: String,
        default: ''
    },
});


export default mongoose.model('webHook', webHookSchema);