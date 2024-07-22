const User = require('../models/userModel');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const {isAuthenticated, isdamin} = require('../middleware/authMiddleware')

// Render Signup Page
const renderSignup = (req, res) => {
    res.render('signup');
};

// Render Login Page
const renderLogin = (req, res) => {
    if (isAuthenticated) {
        res.redirect('/files/dashboard');
    }
    res.render('login');
};

// Render Forgot Password Page
const renderForgotPassword = (req, res) => {
    res.render('forgot-password');
};

// Register user
const signup = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        req.flash('error_msg', 'User already exists');
        res.redirect('/auth/signup');
        return;
    }

    const user = await User.create({
        username,
        email,
        password,
        verificationToken: uuidv4()
    });

    if (user) {
        req.flash('success_msg', 'Registration successful. Please check your email for verification.');
        res.redirect('/auth/login');

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Account Verification',
            text: `Please verify your account by clicking the following link: 
            http://${req.headers.host}/auth/verify-email?token=${user.verificationToken}`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending verification email:', err);
            } else {
                console.log('Verification email sent.');
            }
        });
    } else {
        req.flash('error_msg', 'Invalid user data');
        res.redirect('/auth/signup');
    }
});

// Login user
const login = passport.authenticate('local', {
    successRedirect: '/files/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
});

// Logout user
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
};

// Confirm email to reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        req.flash('error_msg', 'User not found');
        res.redirect('/auth/forgot-password');
        return;
    }

    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset password email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste it into your browser to complete the process:
        http://${req.headers.host}/auth/reset-password/${resetToken}`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('Error sending password reset email:', err);
        } else {
            console.log('Password reset email sent.');
        }
    });

    req.flash('success_msg', 'Password reset email sent');
    res.redirect('/auth/forgot-password');
});

// Verify user email
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        req.flash('error_msg', 'Invalid verification token');
        res.redirect('/auth/login');
        return;
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    req.flash('success_msg', 'Email verified. You can now log in.');
    res.redirect('/auth/login');
});

// Render Reset Password Form
const resetPasswordForm = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        res.redirect('/auth/forgot-password');
        return;
    }

    res.render('reset-password', { token });
});

// Update password
const updatePassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        res.redirect(`/auth/reset-password/${token}`);
        return;
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        res.redirect('/auth/forgot-password');
        return;
    }

    user.password = await password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success_msg', 'Password has been updated');
    res.redirect('/auth/login');
});

module.exports = {
    renderSignup,
    renderLogin,
    renderForgotPassword,
    signup,
    login,
    logout,
    resetPassword,
    verifyEmail,
    resetPasswordForm,
    updatePassword
};