import React, { useState, useEffect } from 'react'
import "../../styles/SignUpForm.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
export default function SignIn() {
    const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
 
  // console.log({ email: email })
 const accessToken = localStorage.getItem("accessToken")
  console.log("signInToken", accessToken) 
   const loggedIn = localStorage.getItem("loggedIn")
   const usernameStorage = localStorage.getItem("usernameStorage")

   //console.log(loggedIn)

  let getLogIn = ()=>{
      fetch("http://localhost:5000/users/login", {
         method: 'POST',
          headers:{
                "Content-Type":"application/json"
            },
           body:JSON.stringify({
                email,
               password
            })
      }).then(res => res.json())
         .then(data => {
           // accessToken =""
            console.log("alldata",data)
            console.log("data", data.token);
            console.log("user", data.loggedIn)
            console.log('username', data.user.username)
            localStorage.setItem("accessToken",data.token)
            localStorage.setItem("loggedIn", data.loggedIn)
            localStorage.setItem("usernameStorage", data.user.username)
            localStorage.setItem ("userAvatar", data.user.pic)
         }
         ).catch(err => {
            console.log(err)
         })
     
   }
   const reloadAndFetch = () => {
      //window.location.reload();
      getLogIn()
   }

   return (<div style={{ width:"90%", margin: "0 auto", marginTop: 80 }}>
       <h3>Welcome Back!</h3>
       <input
          className="input"
            type="text"
            placeholder="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
       <input
          className="input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
      />
        <Link to="/"> <button  className="submit"
            onClick={reloadAndFetch}
            >
                SignIn
            </button></Link>
  </div>)  
}