import {Schema, model, Types} from "mongoose"

const commentSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    comment:{
        type: String,
        required: [true, "Comment is required"],
        maxLength: [180, "Comment cannot be more than 180 characters long"],
        trim: true
    }
}, {
    timestamps: true 
})

const likeSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    }
},{
    timestamps: true
})

const postSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    description: {
        type: String,
        maxLength: [360, "Description cannot be more than 360 characters long"],
        default: "",
        trim: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    likes:{
        type: [likeSchema],
        default: []
    },
    likeCount:{
        type: Number,
        default: 0,
        min : [0, "Like count cannot be negative"]
    },
    comments:{
        type: [commentSchema],
        default: []
    },
    commentCount:{
        type: Number,
        default: 0,
        min : [0, "Comment count cannot be negative"]
    },
    mediaUrl:{
        type: String,
        default: null
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date,
        default: null
    },
    isScheduled: {
        type: Boolean,
        default: false
    },
    scheduledFor: {
        type: Date,
        default: null
    },
    isPublished: {
        type: Boolean,
        default: true
    },
},{
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

postSchema.path("createdAt").immutable(false);
export const PostModel = model("Post", postSchema)