import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import materialize from 'materialize-css'

const Signup = () => {
  const history = useHistory()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")

  const postData = () => {
    
    if (name.length < 5) {
      materialize.toast({ html: "name length shoukd be more than 5 characters", classes: "#c62828 red darken-3" })
      return
    }
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      materialize.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
      return
    }
    if (password.length < 8) {
      materialize.toast({ html: "password length shoukd be more than 8 characters", classes: "#c62828 red darken-3" })
      return
    }

    if (password !== conPassword) {
      materialize.toast({ html: "faild to confirm password", classes: "#c62828 red darken-3" })
      return
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email,
        name
      })
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.error) {
          materialize.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {
          materialize.toast({html:data.message,classes:"#43a047 green darken-1"})
          history.push('/signin')
        }
      }).catch(err => {
        console.log(err)
      })
  }



  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Wellcome</h2>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="confirm-password"
          value={conPassword}
          onChange={(e) => setConPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => postData()}
        >
          Sign Up
            </button>

      </div></div>

  )
}
export default Signup