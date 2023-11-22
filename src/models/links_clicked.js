import mongoose from 'mongoose';

function isModelDefined(modelName) {
    return mongoose.models[modelName] !== undefined;
}

function getModelByName(modelName) {
    return mongoose.model(modelName);
}

const userSchema = new mongoose.Schema({
    link_clicked: {
        type: String,
        required: true,
    },
    link_type: {
        type: String,
        required: true,
    },
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
});

const model_name = 'links_clicked'
const Links_clicked = isModelDefined(model_name) ? getModelByName(model_name) : mongoose.model(model_name, userSchema);

export default Links_clicked;