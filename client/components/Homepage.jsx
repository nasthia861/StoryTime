import React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from'axios';
import Post from './Post.jsx';
import bestOf from '../badgeHelpers/bestOf.jsx';
// import Text from './Text.jsx';

function Homepage() {
  //setting states of generated word, current story, and input using hooks
  //building story from post winners
  const [story, setStory] = useState([])
  const [currentBadgeId, setBadgeId] = useState(1) 
  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  //contenders for next part of the story
  const [posts, setPosts] = useState([])
  const [lastUpdate, setLastUpdate] = useState('')
  //current round of submittions for story, holds words and 
  const [currentPrompt, setCurrentPrompt] = useState({})

  //useEffect to fetch data from database upon mounting
  let latestPrompt;
  let latestBadgeStory;
  let latestStory = story;

  const getWords = () => {
    return axios.get('https://random-word-api.herokuapp.com/word?number=5')
            .then((response) => {
              const wordsForDb = response.data.join(' ')
              //setRound(currentRound++);
              //creates new prompt with 
              axios.post('/prompt', {matchWords: wordsForDb, badgeId: currentBadgeId})
              .then(() => {
                //grabs all prompts
                axios.get('/prompt')
                .then((response) => {
                  latestPrompt = response.data[response.data.length - 1]
                  const wordArray = latestPrompt.matchWords.split(' ')
                  //sets words for prompt
                  setWords(wordArray)
                  //sets current prompt to latest
                  setCurrentPrompt(latestPrompt);
                  //sets prompts to zero
                  setPosts([]);
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

  const newStory = () => {
    axios.post('/badges')
      .then(() => {
        axios.get('/badges')
          .then((response) => {
            latestBadgeStory = response.data[response.data.length - 1]
            setBadgeId(latestBadgeStory.id)
          })
          .catch((error) => console.error('could not get badges', error))
      })
      .catch((error) => console.error('could not create new badge', error));
  }

  useEffect(() => {
    //grabs latest prompt
      axios.get('/prompt')
      .then((response) => {
        if(response.data.length === 0){
        getWords()
        }else{
          latestPrompt = response.data[response.data.length - 1]
          //sets the words of most current prompt
          const wordArray = latestPrompt.matchWords.split(' ')
          setWords(wordArray)
          //sets the most current prompt
          setCurrentPrompt(latestPrompt)
          }
      
        })
      .catch((err) => {
        console.error('Error getting words:', err)
      })
    
    //grabs the most current story
    axios.get('/badges')
      .then((response) => {
        if(response.data.length === 0){
        newStory();
        }else{
        //sets the most current badge
          latestBadgeStory = response.data[response.data.length - 1]
          setBadgeId(latestBadgeStory.id)
        }
      })
      .catch((err) => {
        console.error('Error getting story:', err)
      })

    // grabs all of the texts submitted for current prompt
    axios.get('/prompt')
      .then((response) => {
        const latestPrompt = response.data[response.data.length - 1];
        axios.get(`/text/prompt/${latestPrompt.id}`)
          .then((response) => {
            setPosts(response.data)
          })
          .catch((error) => console.error('could not get latest prompt', error));
     })
      
    const promptInterval = setInterval(() => {
      promptWinner()
      console.log('storyArr', story);
      getWords();
    }, 30000) // this is where to change interval time between prompt changes (currently set to an hour)

    const storyInterval = setInterval(() => {
      setBadgeId(currentBadgeId++);
    }, 300000)
    
    return () => {
      clearInterval(promptInterval);
      clearInterval(storyInterval);
    }


  }, [])

  //changes state of winners
  const promptWinner = () => {
    //grab texts with the current promptId
    axios.get(`/text/prompt/${latestPrompt.id}`)
      .then((textArr) => {
        bestOf(textArr.data)
          .then((best) => {
            //changes the winning state in the text db
            axios.post(`/text/winner/${best.id}`)
            setStory((story) => ([...story, best.text]));

          })
          .catch((error) => console.error('could not set most likes', error));
      })
      .catch((error) => {
        console.error('could not get text in prompt', error);
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
      //setStory(` ${story}`)
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
    //div for wrapper containing all homepage elements
    <div className='wrapper'>
      <div className='word-container'>
        {words.map((word, i) => (
        <span key={i}>{word } </span>
      ))}
      </div>
      
        <div className='story-container'>
          {
            story.map((submission, i) => {
              return <div key={i}>{submission}</div>
            })
          }
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