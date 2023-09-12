import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from'axios';
import Post from './Post.jsx'
import bestOf from '../badgeHelpers/bestOf.jsx'
// import Text from './Text.jsx';

function Homepage() {

  //setting states of generated word, current story, and input using hooks
  const [story, setStory] = useState([])
  const [storyId, setStoryId] = useState(1)
  const [currentRound, setRound] = useState(0)
  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  const [posts, setPosts] = useState([])
  const [lastUpdate, setLastUpdate] = useState('')
  const [mostLikes, setMostLikes] = useState([])
  const [mostWords, setMostWords] = useState([])
  const [currentPrompt, setCurrentPrompt] = useState({})

  //useEffect to fetch data from database upon mounting

  const getWords = () => {
    return axios.get('https://random-word-api.herokuapp.com/word?number=5')
            .then((response) => {
              console.log(response.data)
              const wordsForDb = response.data.join(' ')
              setRound(currentRound++);
              //creates new prompt with 
              axios.post('/prompt', {matchWords: wordsForDb, round: currentRound})
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
    axios.get('/text')
    .then((response) => {
      console.log(response.data)
      setPosts(response.data)
    })
      
    const interval = setInterval(() => {
      changeWinners();
      getWords();
    }, 3600000) // this is where to change interval time between prompt changes (currently set to an hour)

    return () => clearInterval(interval)
  }, [])

  //changes state of winners
  const changeWinners = () => {
    //grab texts with the promptid from current prompt
    axios.get(`/text/?promptId=${currentPrompt}&round=${currentRound}`)
      .then(textArr => {
        bestOf(textArr, likes)
          .then((best) => {
            //sets the winning text to the story
            setStory([...story, best.text]);
          })
          .catch((error) => console.error('could not set most likes', error));
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
      setStory(` ${story}`)
      setInput('')
      //add userId as well once its ready
      axios.post('/text', {text: input, promptId: currentPrompt.id})
      .then(() => {
        axios.get('/text')
        .then((response) => {
          setPosts([response.data[response.data.length -1], ...posts])
        })
      })
      .catch((err) => {
        console.error("err", err)
      })
    }

  }

  
  //return dom elements and structure
  return (
    <div>
      <nav className='nav-btn' >
      <div className='user-div'>
        <Link to="/user">
          <button className='user-btn'>User</button>
        </Link>
      <Link to=''>
        <button className='user-btn' >Button for Logan</button>
      </Link>
      </div>
      </nav>

    {/* //div for wrapper containing all homepage elements */}
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

          <div>
            {
              posts.map((post, i) => (
                <Post key={`${i} - ${post.id}`} text={post} />
              ))
            }
            
          </div>
        </div>

        <div className='posts'>
        </div>

    </div>
    
  </div>
  )
};

export default Homepage