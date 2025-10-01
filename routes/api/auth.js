import express from "express";
const router = express.Router();
import auth from '../../middleware/auth.js';
import User from "../../models/User.js";
import { check, query, validationResult } from "express-validator";
import config from "config";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

router.get('/', auth, async (req,res) =>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});


router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) =>{
    
    const {email, password} = req.body

    const result = validationResult(req);
    if (result.isEmpty()) { 
        try {
            // Check if user exists
            let user = await User.findOne({ email })
            if (!user){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            const payload = {
                user:{
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 360000},
                (err, token) => {
                    if (err) throw err;
                    res.json({token});
            })

            // return res.send('User Registered')
        } catch (error) {
            console.log(error.message);
            return res.status(500).send('Server Error');
        }


    }
    // return res.status(400).json(({errors: result.array()}));
})



export default router