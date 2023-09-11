import React from 'react';
import {BrowserRouter as Router, Routes, Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './Homepage.jsx';
import User from './User.jsx'

function App () {
  return (
    <div className='wrapper'>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/user" element={<User/>} />
        </Routes>
      </Router>
    </div>
    )
};
export default App