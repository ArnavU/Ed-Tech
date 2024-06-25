const User = require("../models/User");
const OTP = require('../models/OTP');
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

// sendOTP
exports.sendOTP = async (req, res) => {

    try {
        // fetch email from request body
        const {email} = req.body;
    
        // check if user already exists
        const checkUserPresent = await User.findOne({email});
    
        // if user already exists, then return response
        if(checkUserPresent) {
            return res.status(409).json({
                success: false,
                message: "User already registered"
            })
        }
    
        // generate opt
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated: ", otp);
        
        // check unique otp or not
        let result = await OTP.findOne({otp: otp});
        
        if(result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
        }
        result = await OTP.findOne({otp: otp});

        const otpPayLoad = {email, otp};

        // create an entry in db for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(201).json({
            success: true,
            message: "OTP Sent Successfully",
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// signUp
exports.signUp = async (req, res) => {
    try {
        // fetch data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            })
        }

        // match both password
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password value does not match"
            })
        }

        // check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false,
                messasge: "User is already registered",
            })
        }

        // find most recent otp for the user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        // validate otp
        if(recentOtp.length == 0) {
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            })
        } else if(otp != recentOtp.otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create entry in db

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        })

        // return res
        return res.status(200).json({
            success: true,
            message: "User is registered Successfully",
            user,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again"
        })
    }
}

// Login
exports.login = async (req, res) => {
    try {
        // get data from req body
        // validate data
        // check if user exists or not
        // generate JWT, after password matching
        // create cookie and send response

        // get data from req body
        const {email, password} = req.body;

        // validate data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please try again",
            })
        }

        // check if user exists or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signUp first",
            })
        }

        // match the password
        if(bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expiress: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure pleases try again"
        })
    }
}

 
// changePassword
exports.changePassword = async (req, res) => {
    // get data from req body
    // get old password, newPassword, confirmPassword
    // validation
    // update pwd in db
    // send mail - password updated
    // return response

    try {
        // get data from req body
        const {email, oldPassword, newPassword, confirmPassword} = req.body;

        // validation
        if(!email || !oldPassword || newPassword || !confirmPassword) {
            return res.status(409).json({
                success: false,
                message: "Please enter all the fields",
            })
        }

        // update password in db
        const response = await User.updateOne({email, password: newPassword});

    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Some error occured while updating password"
        })
    }
}
