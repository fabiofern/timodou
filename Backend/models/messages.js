import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    font: String,
    paper: String,
    encre: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
});

messageSchema.index({ location: '2dsphere' });

export default mongoose.model('Message', messageSchema);
