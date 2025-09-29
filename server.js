const express=require("express")
const cors=require("cors")
const postgresPool=require("pg").Pool
const app=express()
const bodyParser=require("body-parser")
const port=process.env.port || 3005

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
}))

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running successfully on port: ${port}`)
})

const pool=new postgresPool({
    user: "postgres",
    password: "postgres@123",
    database: "student_master",
    host: "localhost",
    port: 5432,
    max: 10
})

pool.connect((err,connection)=>{
    if(err) throw err;
    console.log(`Connected to product_master Database  Successfully!`)
})

app.get("/students",(req,res)=>{
    const sql="SELECT * FROM student";
    pool.query(sql,(err,result)=>{
        if(err) return res.json(err);
        return res.status(200).json(result.rows)
    })
})

app.get("/students/:studentId",(req,res)=>{
    const stdId=Number(req.params.studentId);
    const sql="SELECT * FROM student WHERE studentid=$1";
    pool.query(sql,[stdId],(err,result)=>{
        if(err) return res.json(err);
        return res.status(200).json(result.rows[0])
    })
})

app.post("/students",(req,res)=>{
   const {name,major,email}=req.body
    const sql="INSERT INTO student(name,major,email) VALUES($1,$2,$3) RETURNING *";
    pool.query(sql,[name,major,email],(err,result)=>{
        if(err) return res.json(err);
        return res.status(201).json(result.rows[0])
    })
})

app.patch("/students/:studentId",(req,res)=>{
    const stdId=Number(req.params.studentId);
    const {name,major,email}=req.body
     const sql="UPDATE student SET name=$1,major=$2,email=$3 WHERE studentid=$4";
     pool.query(sql,[name,major,email,stdId],(err,result)=>{
         if(err) return res.json(err);
         return res.status(200).send(`Student is Updated successfully for studentId: ${stdId}`)
     })
 })

 app.delete("/students/:studentId",(req,res)=>{
    const stdId=Number(req.params.studentId);
    const sql="DELETE FROM student  WHERE studentid=$1";
     pool.query(sql,[stdId],(err,result)=>{
         if(err) return res.json(err);
         return res.status(200).send(`Student is Deleted successfully for studentId: ${stdId}`)
     })
 })