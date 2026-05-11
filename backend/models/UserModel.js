import {Schema, model, Types} from "mongoose"

const followsSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    }
}, { 
    _id: false,
    timestamps: true 
})

const userSchema = new Schema({
    firstName:{
        type: String,
        required: [true, "First name is required"],
        minLength: [3, "First name must be at least 3 characters long"],
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minLength: [5, "Username must be at least 5 characters long"],
        trim: true,
        lowercase: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: [5, "Password must be at least 5 characters long"]
    },
    passwordResetVersion: {
        type: Number,
        default: 0
    },
    gender:{
        type: String,
        enum: ["male", "female"]
    },
    dob:{
        type: Date,
        required: [true, "Date of birth is required"],
        validate: {
            validator: function(value) {
                if (value > new Date()) {
                    throw new Error("Date of birth cannot be in the future");
                }
                const cutoff = new Date();
                cutoff.setFullYear(cutoff.getFullYear() - 16);
                return value <= cutoff;
            },
            message:"User must be at least 16 years old"
        }
    },
    bio:{
        type: String, 
        trim: true,
        validate: {
            validator: function(value) {
                if (!value) return true;
                return value.trim().split(/\s+/).length <= 35;
            },
            message: "Bio cannot exceed 35 words"
        }
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    isDeactivated:{
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    followerCount:{
        type: Number,
        default: 0,
        min : [0, "Follower count cannot be negative"]
    },
    followingCount:{
        type: Number,
        default: 0,
        min : [0, "Following count cannot be negative"]
    },
    followers:{
        type: [followsSchema],
        default: []
    },
    following:{
        type: [followsSchema],
        default: []
    },
    profileImageUrl:{
        type: String,
        default: null
    },
    profileImagePublicId:{
    type:String,
    default:null
    },
},
{
    timestamps: true,
    versionKey: false,
    strict: "throw"
});


export const UserModel = model("User", userSchema)