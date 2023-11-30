const mongoose = require('mongoose');

const forumAnswerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        username: String,
        avatarURL: String,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumQuestion',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ForumAnswer = mongoose.model('ForumAnswer', forumAnswerSchema);

module.exports = ForumAnswer;
