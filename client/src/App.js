import React from 'react';
import NavBar from './components/NavBar'
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './components/pages/Home'
import Signin from './components/pages/Signin'
import Signup from './components/pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      
    </BrowserRouter>
  );
}

export default App;