import express from "express";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Profile from "../../models/Profile.js";
const router = express.Router();
import auth from "../../middleware/auth.js";

router.post('/', [auth, check('text', 'text is required').notEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        
        const post = await newPost.save();

        res.json(post);

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }


})

router.get('/', auth, async (req,res) => {
    try {
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

router.get('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.json(post);
    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})


router.delete('/:id', auth, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg: "User not authorized"})
        }
        if (!post){
            return res.status(404).json({msg: 'Post not found'})
        }

        await post.deleteOne();
        res.json({msg: 'Post Removed'});
    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})


router.put('/like/:id', auth, async(req,res) =>{ 
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'Post Already Liked'});
        }

        post.likes.unshift({user:req.user.id})

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})


router.put('/unlike/:id', auth, async(req,res) =>{ 
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'Post Has Not Been Liked'});
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error(error.message)
        if (error.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})


router.post('/', [auth, check('text', 'text is required').notEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        
        const post = await newPost.save();

        res.json(post);

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }


})


router.post('/comment/:id', [auth, check('text', 'text is required').notEmpty()], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({error: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        
        post.comments.unshift(newComment);

        await post.save()

        res.json(post);

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }


})


router.delete('/comment/:id/:comment_id', auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        if(!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router