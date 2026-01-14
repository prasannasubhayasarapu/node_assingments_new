import express from 'express';
const app=express()

app.listen(3000,()=>{
console.log("server started");

})
app.get("/home",(req,res)=>{
  res.json({message:"This is home page"})
})
app.get("/contactus",(req,res)=>{
  res.json({message:"Contact us at contact@contact.com"})
})
app.get("/about",(req,res)=>{
res.json({message:"Welcome to the About page!"})
})
