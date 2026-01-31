const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        
        if (!username || !password) {
            return res.status(400).json({ message: "Fields are missing" });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        console.error("Registration Error:", err); 
        res.status(500).json({ message: err.message });
    }
});
// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        
        const user = await User.findOne({ username });
        if (!user) {
            console.log("User not found");
            return res.status(400).json("Wrong credentials!");
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password does not match");
            return res.status(400).json("Wrong credentials!");
        }

        
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        
        const { password: pw, ...others } = user._doc;
        res.status(200).json({ ...others, token });

    } catch (err) {
        console.error("Login Error Backend:", err); 
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;