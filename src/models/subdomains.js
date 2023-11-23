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
        unique: true,
    },
    cards: {
        type: Array,
        default: [],
    },
    links: {
        type: Object,
        default: [],
    },
    storeName: {
        type: String,
        required: true,
    },
});

const model_name = 'subdomains'
const Subdomains = isModelDefined(model_name) ? getModelByName(model_name) : mongoose.model(model_name, userSchema);

export default Subdomains;