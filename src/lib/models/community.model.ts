import { Schema, model, models } from 'mongoose';

const communitySchema = new Schema({
    id: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: String,
    bio: String,
    private: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Community = models.Community || model('Community', communitySchema);

export default Community;
