import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";


export const register = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.json({success: false, message: "Missing Details"});
    }

    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.json({success: false, message: "User Already Exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name, 
            email,
            password: hashedPassword
        })
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome to Virtual Art Gallary, we are Excited to Have You!`,
            text: `Welcome to Virtual Art Gallary. Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);
        return res.json({success: true});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.json({success: false, message: "Missing Details"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User Does Not Exist with this Account"});
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if(!isCorrect) {
            return res.json({success: false, message: "Incorrect password or email"});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({success: true})

        
    } catch (error) {
        return res.json({success: false, message: error.message})
    }    
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            // maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, message: "Logged Out"});

    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//sending the otp to verify email
export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        console.log(user);
        if(user.isAccountVerified) {
            return res.json({success: false, message: "Account is already verified !"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 1 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: "pri1062003@gmail.com",
            to: user.email,
            subject: "Accout Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true, message: "Verification otp sent on email"})


    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

//verify the email using otp
export const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;
    if(!userId || !otp) {
        return res.json({success: false, message: "Missing Details"});
    }

    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP is expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Email verified successfully"});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//check is user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//send password reset otp
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success: false, message: "Email is required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: "pri1062003@gmail.com",
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to reset your password.`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success: true, message: "Password reset otp sent on email"})

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}


//reset user password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword) {
        return res.json({success: true, message: "Fill all the details"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP is expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: "Password has been reset successfully"});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}