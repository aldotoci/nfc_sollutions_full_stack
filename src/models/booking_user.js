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
    unix_timestamp: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const model_name = 'booking_user'
const Booking_user = isModelDefined(model_name) ? getModelByName(model_name) : mongoose.model(model_name, userSchema);

export default Booking_user;