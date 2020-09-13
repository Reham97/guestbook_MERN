import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/NavBar'
import './App.css';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'

import Home from './components/pages/Home'
import Signin from './components/pages/Signin'
import Signup from './components/pages/Signup'
import CreateEvent from './components/pages/CreateEvent'

import {reducer,initialState} from './components/reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("guestBook-user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push("/")
    }else{
      history.push("/signin") 
    }
  },[])

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/createevent">
        <CreateEvent />
      </Route>
      
    </Switch>

  )
}
const UserContect = createContext()

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter>    
    </UserContext.Provider>

  );
}

export default App;
