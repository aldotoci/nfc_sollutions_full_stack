import mongoose from 'mongoose';
import connectDB from '@/config/mongoose';

connectDB();

function isModelDefined(modelName) {
    return mongoose.models?.[modelName] !== undefined;
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
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
    },
});

const model_name = 'hostess_user'
const Hostess_user = isModelDefined(model_name) ? getModelByName(model_name) : mongoose.model(model_name, userSchema);

export default Hostess_user;