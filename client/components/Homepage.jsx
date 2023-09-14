import React from 'react';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from'axios';
import Post from './Post.jsx';
import Timer from './Timer.jsx'
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
  const [textCount, setTextCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState({})
  

  //set the starting time for the timer
  const actionInterval = 30000; // 30 seconds for testing
  const storedTargetTime = localStorage.getItem('targetTime');
  const initialTargetTime = storedTargetTime ? parseInt(storedTargetTime, 10) : Date.now() + actionInterval;

  //calculate the remaining time based on the target time and current time
  const [remainingTime, setRemainingTime] = useState(initialTargetTime - Date.now());

  //useEffect to fetch data from database upon mounting
  let latestPrompt;
  let latestBadgeStory;
  let allPosts = posts
  
  

  const getWords = () => {
    return axios.get('https://random-word-api.herokuapp.com/word?number=5')
            .then((response) => {
              const wordsForDb = response.data.join(' ')
              //creates new prompt with 
              axios.post('/prompt', {matchWords: wordsForDb, badgeId: currentBadgeId})
              .then(() => {
                //grabs all prompts
                axios.get('/prompt/find/last')
                .then((response) => {
                  latestPrompt = response.data[0]
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
        axios.get('/badges/find/last')
          .then((response) => {
            latestBadgeStory = response.data[0]
            setBadgeId(latestBadgeStory.id)
          })
          .catch((error) => console.error('could not get badges', error))
      })
      .catch((error) => console.error('could not create new badge', error));
  }

  //changes state of winners
  const promptWinner = (allPosts) => {
    //grab texts with the current promptId
    if(allPosts !== undefined){
      axios.get(`/text/prompt/${latestPrompt.id}`)
        .then((textArr) => {
          bestOf(textArr.data)
            .then((best) => {
              //changes the winning state in the text db
              axios.post(`/text/winner/${best.id}`)
              //should rerender story to show new text
              setStory((story) => ([...story, best]));
              //setPosts((posts) => ([...posts, response.data[0]]))
            })
            .catch((error) => console.error('could not set most likes', error));
        })
        .catch((error) => {
          console.error('could not get text in prompt', error);
        })
    }
  }

  useEffect(() => {
    //grabs latest prompt
      axios.get('/prompt/find/last')
      .then((response) => {
        if(response.data.length === 0){
        getWords()
        }else{
          latestPrompt = response.data[0]
          //sets the words of most current prompt
          const wordArray = latestPrompt.matchWords.split(' ')
          setWords(wordArray)
          //grabs all submissions for current prompt
          axios.get(`/text/prompt/${latestPrompt.id}`)
          .then((response) => {
            setPosts(response.data)
          })
          .catch((error) => console.error('could not get latest prompt submissions', error));
          //sets the most current prompt
          setCurrentPrompt(latestPrompt)
          }
      
        })
      .catch((err) => {
        console.error('Error getting words:', err)
      })
    
    //grabs the most current story
    axios.get('/badges/find/last')
      .then((response) => {
        if(response.data.length === 0){
        newStory();
        }else{
        //sets the most current badge
          latestBadgeStory = response.data[0]
          setBadgeId(latestBadgeStory.id)
        }
      })
      .catch((err) => {
        console.error('Error getting story:', err)
      })

    //grabs all of the texts with the matching prompt id and winner set to true
    axios.get(`/text/winner/1/${currentBadgeId}`)
    .then((winnerArr) => {
      //sets story to an array of text obj
      setStory(winnerArr.data)
    })
    .catch((error) => console.error('could not grab winner texts for story'));
      
    const promptInterval = setInterval(() => {
      promptWinner(allPosts)
      setPosts((posts) => ([]))
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

  useEffect(() => {
    

    //update the timer every second
    const timer = setInterval(() => {
      setRemainingTime(prevRemainingTime => {
        if (prevRemainingTime <= 0) {
          return actionInterval;
        }
        return prevRemainingTime - 1000;
      });
    }, 1000);

    //cleanup
    return () => {
      clearInterval(appInterval);
      clearInterval(timer);
    };
  }, [actionInterval]);
  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);


  //function to handle input change
  const handleInput = (event) => {
    setInput(event.target.value)
    setTextCount(event.target.value.length)
  }

  //function to handle user submit
  const handleSubmit = () => {
    //sets story to current story plus users input
    if(input !== ''){
      //setStory(` ${story}`)
      setInput('')
      setTextCount(0)
      //add userId as well once its ready
      axios.post('/text', {text: input, promptId: currentPrompt.id})
      .then(() => {
        axios.get('/text/find/last')
        .then((response) => {
          setPosts((posts) => ([...posts, response.data[0]]));
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
      <div>
        <Timer minutes={minutes} seconds={seconds} />
      </div>
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
          {
            story.map((submission, i) => {
              return <div key={submission.id}>{submission.text}</div>
            })
          }
        </div>

        <div >
          
          <textarea 
          className='user-input'
          type='text'
          placeholder='Add to the story!' 
          onChange={handleInput}
          value={input}
          maxLength={150}
          />
          <div className='text-count'>
            {textCount}/150
          </div>
          <div className='submit'>
          <button className='submit-btn' onClick={handleSubmit}>Submit</button>
          </div>

          <div>
          {
              posts.map((post) => {
                return <Post key={post.id} text={post}/>
              })
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