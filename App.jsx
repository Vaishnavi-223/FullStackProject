

import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {

  const [students,setStudents]=useState([])
  const [filteredStudents,setFilteredStudents]=useState([])
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [studentData,setStudentData]=useState({name:"",major:"",email:""})
  const [errorMsg,setErrorMsg]=useState("")

  const openPopup=()=>{
    setIsModalOpen(true)
  }

  const handleClose=()=>{
    setIsModalOpen(false)
    getAllStudents();
    setStudentData({name:"",major:"",email:""});
    setErrorMsg("");
  }

  const getAllStudents=()=>{
    axios.get("http://localhost:3005/students").then((res)=>{
      setStudents(res.data)
      setFilteredStudents(res.data)
    })
  }
  const handleSearch=(e)=>{
    const searchValue=e.target.value.toLowerCase();
    const filteredData=students.filter(student=>student.name.toLowerCase().includes(searchValue) ||
    student.major.toLowerCase().includes(searchValue) ||
    student.email.toLowerCase().includes(searchValue))
    setFilteredStudents(filteredData);
  }

  const handleChange=(e)=>{
    setStudentData({...studentData,[e.target.name]:e.target.value});
  }

  const handleUpdate=(student)=>{
    setStudentData(student);
    openPopup();
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    let errMsg="";
    if(!studentData.name || !studentData.major || !studentData.email){
      errMsg="All fields are required!";
      setErrorMsg(errMsg);
    }
    if((errMsg.length==0) && studentData.studentid){
      await axios.patch(`http://localhost:3005/students/${studentData.studentid}`,studentData).then((res)=>{
        console.log(res.data)
      })
    }else if(errMsg.length==0) {
      await axios.post("http://localhost:3005/students",studentData).then((res)=>{
        console.log(res.data)
        
      })
    }
    if((errMsg.length==0)){
      handleClose();
    }
    
  }

  const handleDelete=async(studentId)=>{
    const isConfirmed=window.confirm("Are you sure you want to Delete?");
    if(isConfirmed){
      await axios.delete(`http://localhost:3005/students/${studentId}`).then((res)=>{
        setStudents(res.data)
        setFilteredStudents(res.data)
      })
    }
    window.location.reload();
  }

  useEffect(()=>{
    getAllStudents()
  },[])

  return (
    <>
    <div className='std-container'>
      <h3>Full Stack Application using React JS, Nodejs & PostgreSQL</h3>
      <div className='search-box'>
          <input className='search-input' onChange={handleSearch} type="search" name="searchinput" id="searchinput" placeholder='Search Student Here' />
          <button className='addBtn addeditcolor' onClick={openPopup}>Add</button>
      </div>
      <div className='table-box'>
        {isModalOpen && <div className='addeditpopup'>
                <span className='closeBtn' onClick={handleClose}>&times;</span>
                <h4>Student  Detail</h4>
                {errorMsg && <p className='error'>{errorMsg}</p>}
                <div className='popupdiv'>
                  <label className='popuplabel' htmlFor="name">Name</label> <br></br>
                  <input className='popupinput' value={studentData.name} onChange={handleChange} type="text" name="name" id="name" />
                </div>
                <div className='popupdiv'>
                  <label className='popuplabel' htmlFor="major">Major</label> <br></br>
                  <input className='popupinput'   value={studentData.major} onChange={handleChange} type="text" name="major" id="major" />
                </div>
                <div className='popupdiv'>
                  <label className='popuplabel' htmlFor="email">Email</label> <br></br>
                  <input className='popupinput'  value={studentData.email} onChange={handleChange} type="text" name="email" id="email" />
                </div>
                <br>
                </br>
                <button className='addstudentBtn addeditcolor' onClick={handleSubmit}>{studentData.studentid?"Update Student": "Add Student"}</button>
           </div>}
        <table className='table'>
          <tr>
            <th>StudentId</th>
            <th>Name</th>
            <th>Major</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          <tbody>
           {filteredStudents && filteredStudents.map(student=>{
            return (<tr key={student.studentid}>
              <td>{student.studentid}</td>
              <td>{student.name}</td>
              <td>{student.major}</td>
              <td>{student.email}</td>
              <td><button className='editBtn addeditcolor' onClick={()=>handleUpdate(student)}>Edit</button></td>
              <td><button className='deleteBtn deletecolor'  onClick={()=>handleDelete(student.studentid)}>Delete</button></td>
            </tr>)
           })}
          </tbody>
        </table>
      
      </div>

    </div>
      
    </>
  )
}

export default App
