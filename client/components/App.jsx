import React from 'react';
import Homepage from './homepage.jsx';
import User from './User.jsx';
import axios from 'axios';
import bestOf from '../badgeHelpers/bestOf.jsx'

class App extends React.Component {
  constructor(){
    super()
    this.setState() = {
      currentPrompt: {},
      textMostLikes: [],
      textMostWordCt: [],
    }
  }
  
  changeWinners() {
    axios.post(`/text/prompt/${currentPrompt.id}`)
      .then(textArr => {
        bestOf(textArr, likes, textMostLikes);
        bestOf(textArr, wordMatchCt, textMostWordCt);
      })
      .catch((error) => {
        console.error('could not change state of winners', error);
      })
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