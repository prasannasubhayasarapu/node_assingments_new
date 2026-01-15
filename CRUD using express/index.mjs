import fs, { writeFileSync,readFileSync } from "fs"
import express from 'express'
const app=express()
app.use(express.json())

function readdata(){
    const data=fs.readFileSync("./db.json","utf-8")
    return JSON.parse(data)
}
function writedata(data){
    fs.writeFileSync("./db.json",JSON.stringify(data,null,2))
}

app.get("/students",(req,res)=>{
const data=readFileSync("./db.json","utf-8")
const students=JSON.parse(data)
res.send(students)
})
app.post("/students",(req,res)=>{
  writedata(data)
res.status(201).json({
    message:"student added successfully",
    student:req.body
})
 })
 app.get("/students/:id",(req,res)=>{
const data=readdata()

    const student=data.students.find(u=>u.id===req.params.id)
    if(!student){return res.status(404).send("student not found")}
res.json(student)

 })

 app.put("/students/:id",(req,res)=>{
const data=readdata()
    const student=data.students.find(u=>u.id===req.params.id)
    if(!student) return res.send("student not found")
        student.name=req.body.name
    writedata(data)
    res.send(req.body)
 })

 app.delete("/students/:id",(req,res)=>{
    const data=readdata()
    data.students=data.students.find(u=>u.id!=req.params.id)
   writedata(data)
   res.send("user deleted successfully")
 })
app.listen(3000,()=>{
    console.log("server started");
    
})