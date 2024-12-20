import mongoose from 'mongoose';
const registeredEvent = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name for event'],
            trim: true,
        },
        event:{
            type: mongoose.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        registeredBy:{
            type:mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    { timestamps: true }
);


export default mongoose.models.registeredEvent || mongoose.model('registeredEvent', registeredEvent);