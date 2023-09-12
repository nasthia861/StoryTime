import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from'axios';
import bestOf from '../badgeHelpers/bestOf.jsx'
import Text from './Text.jsx';

function Homepage() {

  //setting states of generated word, current story, and input using hooks
  const [story, setStory] = useState(['Why run to alleviate infallible pain?'])
  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  const [lastUpdate, setLastUpdate] = useState('')
  const [mostLikes, setMostLikes] = useState([])
  const [mostWords, setMostWords] = useState([])
  const [currentPrompt, setCurrentPrompt] = useState({});

  //useEffect to fetch data from database upon mounting

  const getWords = () => {
    return axios.get('https://random-word-api.herokuapp.com/word?number=5')
            .then((response) => {
              console.log(response.data)
              const wordsForDb = response.data.join(' ')
              axios.post('/prompt', {matchWords: wordsForDb})
              .then(() => {
                axios.get('/prompt')
                .then((response) => {
                  console.log("this", response.data[response.data.length - 1])
                  const wordArray = response.data[response.data.length - 1].matchWords.split(' ')
                  setCurrentPrompt(response.data[response.data.length - 1])
                  setWords(wordArray)
                })
                .catch((err) => {
                console.error("Could not get prompts", err)
                })
    
              })
              .catch((err) => {
                console.error("Could not Submit!", err)
              })
          localStorage.setItem('lastUpdate', new Date().toString())
        })
        .catch((err) => {
          console.error("Couldnt get words!", err)
        })
  }

  useEffect(() => {
      axios.get('/prompt')
      .then((response) => {
        if(response.data.length === 0){
        getWords()

      }else{
        const wordArray = response.data[response.data.length - 1].matchWords.split(' ')
        setWords(wordArray)
        setCurrentPrompt(response.data[response.data.length - 1])
        }
    
    })
    .catch((err) => {
      console.error('Error getting words:', err)
      })
      
    const interval = setInterval(() => {
      getWords()
    }, 3600000) // this is where to change interval time between prompt changes (currently set to an hour)

    return () => clearInterval(interval)
  }, [])

  //changes state of winners
  const changeWinners = () => {
    //grab texts with the promptid from current prompt
    axios.get(`/text/prompt/${currentPrompt.id}`)
      .then(textArr => {
        bestOf(textArr, likes)
          .then((best) => setMostLikes(best))
          .catch((error) => console.error('could not set most likes', error));
        bestOf(textArr, wordMatchCt)
          .then((best) => setMostWords(best))
          .catch((error) => console.error('could not set most wordMatchCt', error));
      })
      .catch((error) => {
        console.error('could not change state of winners', error);
      })
  }

  //function to handle input change
  const handleInput = (event) => {
    setInput(event.target.value)
  }

  //function to handle user submit
  const handleSubmit = () => {
    //sets story to current story plus users input
    if(input !== ''){
      setStory(` ${story} <br>${input}`)
      setInput('')
    }

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

          <div className='user-div'>
            <Link to="/user">
              <button className='user-btn'>User</button>
            </Link>
          </div>
          <div>
            <Text text={{id: 1}} />
          </div>
        </div>

    </div>
    
  )
};

export default Homepage