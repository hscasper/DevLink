import express from "express";
const router = express.Router();

router.get('/', (req,res) =>{
    res.send('Profile Route');
})

export default router