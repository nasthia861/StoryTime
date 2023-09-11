import React from 'react';
import {BrowserRouter as Router, Routes, Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import User from './User.jsx';
import Post from './Post.jsx';

function App () {
  return (
    <div className='wrapper'>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/text/id" element={<Post/>} />
        </Routes>
      </Router>
    </div>
    )
};
export default App