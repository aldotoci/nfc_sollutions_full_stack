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
    card_id: {
        type: Number,
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
    URL: {
        type: String,
        required: true,
    }
});

const model_name = 'subdomain_views'
const Subdomain_views = isModelDefined(model_name) ? getModelByName(model_name) : mongoose.model(model_name, userSchema);

export default Subdomain_views;