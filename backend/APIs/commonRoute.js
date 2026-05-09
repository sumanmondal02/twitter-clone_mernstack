import exp from 'express'
import {hash,compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {verifyToken} from '../middlewares/verifyToken.js'
import {config} from "dotenv";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
import {UserModel} from '../models/UserModel.js'
import { sendEmail } from "../config/sendEmail.js";

const {sign} = jwt
config();
export const commonRoute = exp.Router()

// Registration for user
commonRoute.post('/register', upload.single('profileImageUrl'), async (req, res, next) => {
    let cloudinaryResult;
    try {
        const userObj = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            gender: req.body.gender,
            dob: req.body.dob,
            profileImageUrl: null,
            isAdmin: false,
            isBlocked: false,
            isDeactivated: false,
            followers: [],
            followerCount: 0,
            following: [],
            followingCount: 0
        };
        // console.log("New User Data:", userObj);
        // console.log("Profile Image File:", req.file);
        if (!userObj.email || !userObj.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await UserModel.findOne({$or: [{email: userObj.email}, {username: userObj.username}]});
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }
        else if (!userObj.username || !userObj.firstName || !userObj.dob) {
            return res.status(400).json({ message: "Username, first name and date of birth are required" });
        }
        else if (req.file) {
            cloudinaryResult = await uploadToCloudinary(req.file.buffer);
            userObj.profileImageUrl = cloudinaryResult.secure_url;
        } else {
            userObj.profileImageUrl = null;
        }
        userObj.password = await hash(userObj.password, 12);
        const newUserDoc = new UserModel(userObj);
        await newUserDoc.save();
        // console.log("USER SAVED:", newUserDoc._id);
        const { password, isAdmin, isBlocked, isDeactivated, gender, dob, followerCount, followingCount, ...payload } = newUserDoc.toObject()
        res.status(201).json({message: "Account created successfully, Please log in.", payload});
    } catch (err) {
        console.error("Registration Error:", err);
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
    }
});

//Login route
commonRoute.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: "Email/username and password required" });
    }
    // Determine if identifier looks like an email or a username
    const isEmail = identifier.includes("@");
    const query = isEmail
        ? { email: identifier.toLowerCase().trim() }
        : { username: identifier.toLowerCase().trim() };
    const user = await UserModel.findOne(query);
    if (!user) {
      return res.status(404).json({ message: isEmail 
          ? "User not found, please check your email" 
          : "User not found, please check your username" 
      });
    } else if (user.isDeactivated === true) {
      return res.status(403).json({ message: "Your account is deactivated, Press Enter to reactivate" });
    } else if (user.isBlocked === true) {
      return res.status(403).json({ message: "Your account is blocked, Please contact support" });
    } else {
        const { _id, firstName, lastName, username, profileImageUrl, email, isAdmin } = user.toObject();
        const isMatched = await compare(password, user.password);
        if (!isMatched) return res.status(401).json({ message: "Invalid credentials" });

        const token = sign({
            id: _id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            profileImageUrl: profileImageUrl
        }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // Set to true in production with HTTPS
        });

        return res.status(200).json({
            message: `${firstName} ${lastName} Login Successful`,
            payload: { _id, firstName, lastName, username, email, isAdmin, profileImageUrl }
        });
    }
  } catch(err) {
      console.error("Error in login: ", err);
      next(err);
  }
});

//Logout route
commonRoute.post("/logout", (req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        secure:false, // Set to true in production with HTTPS
        sameSite:"lax"
    });
    res.status(200).json({message:"Logout successful"})
})

//Page Refresh
commonRoute.get("/check-auth", verifyToken, (req, res) => {
  res.status(200).json({
    message: "authenticated",
    payload: {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        profileImageUrl: req.user.profileImageUrl,
        isAdmin: req.user.isAdmin
    }
  });
});

//Change Password
commonRoute.put("/change-password", verifyToken, async(req, res, next)=>{
    try {
        //get email, old password and new password from req body
        const {currentPassword, newPassword} = req.body;
        //find user by email from decoded token
        // const email = req.user?.email;
        const user = await UserModel.findById(req.user.id); // already verified by token, so directly using id
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        else if (user.isDeactivated === true) {
            return res.status(403).json({message: "Your account is deactivated, Press Enter to reactivate"});
        }
        else if (user.isBlocked === true) {
            return res.status(403).json({message: "Your account is blocked, Please contact support"});
        }
        else{
            //if current password or new password is missing in req body
            if(!currentPassword || !newPassword){
                return res.status(400).json({message:"Current and New password required"})
            }
            //check if new password is same as old password
            const isSamePassword = await compare(newPassword, user.password);
            if(isSamePassword){
                return res.status(400).json({message: "New Password must be different from Current Password"})
            }
            //verify old password
            const isMatch = await compare(currentPassword, user.password);
            if(!isMatch){
                return res.status(401).json({message: "Invalid Current Password"})
            }
            //hash new password and update in database
            user.password = await hash(newPassword, 12);
            await user.save();
            res.status(200).json({message: "Password Changed Successfully"})
        }
    } catch (err) {
        console.error("Error in change password: ", err);
        next(err);
    }
})

//Forgot-Password
commonRoute.post("/forgot-password", async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({message: "Email is required"});
        }
        const user = await UserModel.findOne({email: email.toLowerCase().trim()});
        // Security: don't reveal account existence
        if (!user) {return res.status(404).json({message: "Email not registered. Please create an account."});}
        const resetToken = sign({id: user._id, email: user.email, version: user.passwordResetVersion}, process.env.SECRET_KEY, { expiresIn: "10m" });
        const resetLink =`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family:sans-serif">
                    <h2>Password Reset for X-Clone Account</h2>
                    <p>Click below to reset password:</p>
                    <a href="${resetLink}">
                        Reset Password
                    </a>
                    <p>Expires in 10 minutes.</p>
                </div>
            `,
        });
        return res.status(200).json({message: "Reset link sent successfully"});
    } catch (err) {
        next(err);
    }
});

//Reset Password
commonRoute.put("/reset-password/:token", async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({message: "New password required"});
        }
        // verify jwt
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // find user
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        // check if reset link already used
        if (
            decoded.version !== user.passwordResetVersion
        ) {
            return res.status(400).json({message: "Reset link already used"});
        }
        // hash new password
        user.password = await hash(newPassword, 12);
        // invalidate old links
        user.passwordResetVersion += 1;
        await user.save();
        return res.status(200).json({message: "Password reset successful"});
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({message: "Reset link expired"});
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(400).json({message: "Invalid reset link"});
        }
        next(err);
    }
});

// Account Reactivation
commonRoute.post("/reactivate", async (req, res, next) => {
    try{
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })
        if (!user.isDeactivated) return res.status(400).json({ message: "Account already active" });
        if (user.isBlocked) return res.status(403).json({ message: "Account is blocked, contact support" })
        const isMatch = await compare(password, user.password)
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })
        await UserModel.findByIdAndUpdate(user._id, { isDeactivated: false })
        res.status(200).json({ message: "Account reactivated successfully. Please login again." })
    } catch (err) {
        console.error("Error in account reactivation: ", err);
        next(err);
    }
})