import React from 'react';
import Homepage from './homepage.jsx';
import User from './User.jsx'

class App extends React.Component {
  constructor(){
    super()
  }

  render(){
    return (
      <div>
        {/* <Homepage/> */}
        <User/>
      </div>
    )
  }
}
export default App