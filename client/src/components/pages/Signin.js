import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import materialize from 'materialize-css'
import {UserContext} from '../../App'

const Signin = () => {
  const history = useHistory()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {state,dispatch} = useContext(UserContext)

  const postData = () => {
    
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email,
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.error) {
          materialize.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {
          localStorage.setItem("guestBook-jwt",data.token)
          localStorage.setItem("guestBook-user",JSON.stringify(data.user))
          dispatch({type:"USER",payload:data.user})
          materialize.toast({ html: "signedin success", classes: "#43a047 green darken-1" })
          history.push('/')
        }
      }).catch(err => {
        console.log(err)
      })
  }


  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Wellcome Back</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => postData()}
        >
          Sign In
            </button>

      </div></div>

  )
}
export default Signin