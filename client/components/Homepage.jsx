import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from'axios';

function Homepage() {
  //setting states of genrated word, current story, and input using hooks
  const [words, setWords] = useState(['alleviate', 'run', 'no', 'why', 'infallible'])
  const [story, setStory] = useState(['Why run to alleviate infallible pain?'])
  const [input, setInput] = useState('')

  //useEffect to fetch data from database upon mounting

  // useEffect(() => {
  //   axios.get('/api/words')
  //   .then(response => {
  //     setWords(response.data)
  //   })
  //   .catch(err => {
  //     console.error('Error getting words:', err)
  //   })
  // }, [])

  //funciton to handle input change
  const handleInput = (event) => {
    setInput(event.target.value)
  }

  //function to handle user submit
  const handleSubmit = () => {
    //sets story to current story plus users input
    setStory(`${story} <br>${input}`)
    setInput('')
  }

  
  //return dom elements and structure
  return (
    //div for wrapper containing all homepage elements
    <div className='wrapper'>
      <div className='word-container'>
        {words.map((word, i) => (
        <span key={i}>{word } </span>
      ))}
      </div>
      
        <div className='story-container'>
          <p dangerouslySetInnerHTML={{__html: story}} ></p>
        </div>

        <div>
          
          
          <input 
          className='user-input'
          type='text'
          placeholder='Add to the story!' 
          onChange={handleInput}
          value={input}
          />
          <div className='submit'>
          <button className='submit-btn' onClick={handleSubmit}>Submit</button>
          </div>

          <div >
            <Link to="/user">
              <button className='user-btn'>User</button>
            </Link>
          </div>

        </div>

    </div>
    
  )
};

export default Homepage