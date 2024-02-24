import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    image: String,
    bio: String,
    threads: [{
        type: Schema.Types.ObjectId,
        ref: 'Thread'
    }],
    onboarded: {
        type: Boolean,
        default: false
    },
    private: {
        type: Boolean,
        default: false
    },
    communities: [{
        type: Schema.Types.ObjectId,
        ref: 'Community'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const User = models.User || model('User', userSchema);

export default User;
