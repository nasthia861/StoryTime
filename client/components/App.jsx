import React from 'react';
import {BrowserRouter as Router, Routes, Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import User from './User.jsx';
import Post from './Post.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';


function App () {
  return (
    <div className='wrapper'>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/text/id" element={<Post/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
    )
};
export default App