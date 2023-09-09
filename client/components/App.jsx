import React from 'react';
import Homepage from './homepage.jsx';
import User from './User.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(){
    super()
    this.setState() = {
      currentPrompt: {},
      textMostLikes: [],
      textMostWordCt: [],
    }
  }

  //sets winner
  BestOf(array, comp, key) {  
    array.reduce((acc, current) => {
      //if there is already a tie
      if (acc.length > 1){
        if(current.comp > acc[0].comp){
          acc = [current];
          return acc;
        }
      }
      //for ties
      if (current.comp === acc.comp){
        acc.push(current);
        return acc;
      }
      if (current.comp > acc.comp) {
        acc = [current];
        return acc;
      }
    }, [])
      .then((bestText) => {
        this.setState({
          [key]: bestText
        })
      })
      .catch((error) => {
        console.error(`could not set winner for ${key}`, error);
      });
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