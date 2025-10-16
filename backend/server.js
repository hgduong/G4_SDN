const express=require('express');
const connectDB=require('./config/db');
const router=require('./index.js');
const app=express();
connectDB();
app.use(express.json()); 
app.use("/",router);
const PORT=process.env.PORT||9999
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});