import mongoose from 'mongoose';

function isModelDefined(modelName) {
    return mongoose.models[modelName] !== undefined;
}

function getModelByName(modelName) {
    return mongoose.model(modelName);
}

const userSchema = new mongoose.Schema({
    subdomain_name: {
        type: String,
        required: true,
    },
    unix_timestamp: {
        type: Number,
        required: true,
    },
    user_agent: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: false,
    },
    reserved_time: {
        type: Date,
        required: true,
    },
    reserved_table: {
        type: String,
        defaultValue: 'To Be Decided',
    },
    full_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    email_address: {
        type: String,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
});

const model_name = 'booking'
const Links_clicked = isModelDefined(model_name) ? getModelByName(model_name) : mongoose.model(model_name, userSchema);

export default Links_clicked;