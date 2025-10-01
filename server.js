import express from 'express'
import connectDB from './config/db.js';
import userRouter from './routes/api/users.js'
import authRouter from './routes/api/auth.js'
import postRouter from './routes/api/post.js'
import profileRouter from './routes/api/profile.js'

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.get('/', (req,res) =>{
    res.send("Api Up")
});

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/profile', profileRouter);


app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});