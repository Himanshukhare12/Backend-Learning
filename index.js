require('dotenv').config();
const express=require('express');
const app=express();
const PORT=process.env.PORT;
app.get('/',(req,res)=>res.send('Hello World!'));
app.get('/Himanshu',(req,res)=>res.send("hello Himanshu!"));
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));

