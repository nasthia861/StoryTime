import React from 'react';
import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import axios from'axios';
import Post from './Post.jsx';
import Timer from './Timer.jsx'
import {bestOf, mostContribution, bestMatched} from '../badgeHelpers/bestOf.jsx';
// import Text from './Text.jsx';

function Homepage() {
  //setting states of generated word, current story, and input using hooks
  //building story from post winners
  const [story, setStory] = useState([])
  const [currentBadgeId, setBadgeId] = useState() 
  const [input, setInput] = useState('')
  const [words, setWords] = useState([])
  //contenders for next part of the story
  const [posts, setPosts] = useState([])
  const [userId, setUser] = useState(2);
  const [textCount, setTextCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState({})
  

  //set the starting time for the timer
  const actionInterval = 30000; // 30 seconds for testing
  const storedTargetTime = localStorage.getItem('targetTime');
  const initialTargetTime = storedTargetTime ? parseInt(storedTargetTime, 10) : Date.now() + actionInterval;

  //calculate the remaining time based on the target time and current time
  const [remainingTime, setRemainingTime] = useState(initialTargetTime - Date.now());

  let latestPrompt;
  let latestBadgeStoryId;
////////////////////////////////////
  /////////HELPER FUNCTIONS///////
  ////////////////////////////////
  //creates a new round of submissions for the next iteration of the main story
  const newRound = () => {
    return axios.get('https://random-word-api.herokuapp.com/word?number=5')
            .then((response) => {
              const wordsForDb = response.data.join(' ')
              //creates new prompt with new matchWords and current story id
              console.log('coming from newRound', latestBadgeStoryId);
              axios.post('/prompt', {matchWords: wordsForDb, badgeId: latestBadgeStoryId})
              .then(() => {
                //grabs latest prompt
                axios.get('/prompt/find/last')
                .then((response) => {
                  latestPrompt = response.data[0]
                  const wordArray = latestPrompt.matchWords.split(' ')
                  //sets words for prompt
                  setWords(wordArray)
                  //sets current state prompt to latest
                  setCurrentPrompt(latestPrompt);
                  //sets posts to zero
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

  //starts a new story, should reset once a day
  const newStory = () => {
    //creates a new badge/story
    axios.post('/badges')
      .then(() => {
        //grabs newly created badge
        axios.get('/badges/find/last')
          .then((response) => {
            latestBadgeStoryId = response.data[0].id
            //sets the new story state id
            console.log('coming from newStory', latestBadgeStoryId);
            setBadgeId(latestBadgeStoryId)
            //setStory([]);
          })
          .catch((error) => console.error('could not get badges', error))
      })
      .catch((error) => console.error('could not create new badge', error));
  }

  //picks submission with most likes and makes it part of the main story
  const promptWinner = () => {
    //grab texts with the current promptId
    axios.get(`/text/prompt/${latestPrompt.id}`)
      .then((textArr) => {
        //runs through function to determine submission with most likes
        bestOf(textArr.data)
        .then((best) => {
          //changes the winning state in the text db
          axios.post(`/text/winner/${best.id}`)
          //rerenders story to show new text
          setStory((story) => ([...story, best]));
        })
      })
      .catch((error) => {
        console.error('no posts submitted', error);
      })
  }

  const awardCeremony = () => {
    //grab all winning submissions
    console.log('Welcome to award show #', latestBadgeStoryId)
    axios.get(`/text/winner/1/${latestBadgeStoryId}`)
      //pass them through function that checks for most overall likes
      .then((textArr) => {
        console.log('contestants', textArr)
        //send badge to user that owns text with overall most likes
        bestOf(textArr.data)
          .then((text) => {
            console.log('for most overall likes', text)
            axios.post(`/user/badges/${text.userId}`, { badge: 'Likeable' })
              .catch(console.error('could not post to user badges'))
            axios.post(`/badges/${latestBadgeStoryId}/mostLikes`, { newValue: text.userId})
              .catch(console.error('could not update badges for story'))
          })
        //send badge to user/s that made the most contributions
        mostContribution(textArr.data)
        //send badge to user/s
          .then((winnerArr) => {
            console.log('for best contributor/s [id, contribution count]', winnerArr);
            //single winner
            if(winnerArr.length === 2){
                axios.post(`/user/badges/${winnerArr[0]}`, { badge: 'Contributor' })
                  .catch(console.error('could not post to user badges'))
                axios.post(`/badges/${latestBadgeStoryId}/mostContributions`, { newValue: winnerArr[0]})
                  .catch(console.error('could not post to user badges'))
            //multiple winners
            } else if (winnerArr.length > 2) {
              let multipleWinnersId = ''
              for(let x = 0; x < winnerArr.length; x+=2){
                axios.post(`/user/badges/${winnerArr[x]}`, { badge: 'Contributor' })
                  .catch(console.error('could not post to user badges'))
                multipleWinnersId += `${winnerArr[x]}...`
              }
              axios.post(`/badges/${latestBadgeStoryId}/mostContributions`, { newValue: multipleWinnersId})
                .catch(console.error('could not post to user badges'))
            }
          })
        //pass them through function that checks for most matched words
        bestMatched(textArr.data)
        //send badge to user/s that owns winning text/s
          .then((winnerArr) => {
            console.log('for best word matcher/s [id, word match count]', winnerArr);
            //single winner
            if(winnerArr.length === 2){
                axios.post(`/user/badges/${winnerArr[0]}`, { badge: 'Matcher' })
                  .catch(console.error('could not post to user badges'))
                axios.post(`/badges/${latestBadgeStoryId}/mostWordMatchCt`, { newValue: winnerArr[0]})
                  .catch(console.error('could not post to user badges'))
            //multiple winners
            } else if (winnerArr.length > 2) {
              let multipleWinnersId = ''
              for(let x = 0; x < winnerArr.length; x+=2){
                axios.post(`/user/badges/${winnerArr[x]}`, { badge: 'Matcher' })
                  .catch(console.error('could not post to user badges'))
                multipleWinnersId += `${winnerArr[x]}...`
              }
              axios.post(`/badges/${latestBadgeStoryId}/mostWordMatchCt `, { newValue: multipleWinnersId})
                .catch(console.error('could not post to user badges'))
            }
          })
      })
      .catch((error) => console.error('failed to grab all winning submissions', error))
      //   //update badges info in db to include user info of winners
  }
  
  ////////////////////////
  //INTERVALS START HERE///////
  ///////////////////////////

    //picks winning submission and starts a new round
    const promptInterval = setInterval(() => {
      promptWinner()
      newRound();
    }, 10000) // this is where to change interval time between prompt changes (currently set to an hour)
    
    const storyInterval = setInterval(() => {
      awardCeremony();
      newStory()
      //newRound();
    }, 60000)

//////////////////////////////////
//USE EFFECTS START HERE 
//////////////////////////////////
  useEffect(() => {
    //grabs the most current story
    axios.get('/badges/find/last')
      .then((response) => {
        //only hits if badges table is empty
        if(response.data.length === 0){
        newStory();
        }else{
        //sets the most current badge
          latestBadgeStoryId = response.data[0].id
          //rerenders
          setBadgeId(latestBadgeStoryId)
        }
      })
      .catch((err) => {
        console.error('Error getting story:', err)
      })

    // //grabs latest prompt, texts submitted to prompt, and words associated
    // axios.get('/prompt/find/last')
    //   .then((response) => {
    //     //conditional for if prompt table is empty
    //     if(response.data === undefined){
    //       newRound()
    //     }else{
    //       latestPrompt = response.data[0]
    //       //sets the words of most current prompt
    //       //console.log(latestPrompt.current);
    //       const wordArray = latestPrompt.matchWords.split(' ')
    //       setWords(wordArray)
    //       //sets the most current prompt
    //       setCurrentPrompt(latestPrompt)
    //       //grabs all of the texts already submitted for prompt
    //       axios.get(`/text/prompt/${latestBadgeStoryId}`)
    //         .then((response) => {
    //           setPosts(response.data)
    //         })
    //         .catch((error) => console.error('could not get latest prompt', error));
    //       }
    //     })
    //   .catch((err) => {
    //     console.error('Error getting words:', err)
    //   })
    
  }, [])

  //renders when currentBadgeId is changed
  useEffect(() => {
    latestBadgeStoryId = currentBadgeId;
    console.log('coming from useEffect', currentBadgeId);
        //grabs all of the texts that are already a part of the main story
    axios.get(`/text/winner/1/${currentBadgeId}`)
      .then((winnerArr) => {
        //sets story to an array of text obj
        setStory(winnerArr.data)
      })
      .catch((error) => console.error('the current story is empty'));

     //grabs latest prompt, texts submitted to prompt, and words associated
     axios.get('/prompt/find/last')
     .then((response) => {
       //conditional for if prompt table is empty
       if(response.data === undefined){
         newRound()
       }else{
         latestPrompt = response.data[0]
         //sets the words of most current prompt
         const wordArray = latestPrompt.matchWords.split(' ')
         setWords(wordArray)
         //sets the most current prompt
         setCurrentPrompt(latestPrompt)
         //grabs all of the texts already submitted for prompt
         axios.get(`/text/prompt/${latestPrompt.id}`)
           .then((response) => {
             setPosts(response.data)
           })
           .catch((error) => console.error('there are no submission for this round', error));
         }
       })
     .catch((err) => {
       console.error('Error getting words:', err)
     })

     storyInterval();
    
    // const storyInterval = setInterval(() => {
    //   awardCeremony();
    //   newStory()
    //   //newRound();
    // }, 60000)

    // return () => {
    //   clearInterval(storyInterval);
    // }

  }, [currentBadgeId])

  useEffect(() => {
    promptInterval();
  }, [currentPrompt])

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
    if(input !== ''){
      setInput('')
      setTextCount(0)
      axios.post('/text', {text: input, userId: userId , promptId: currentPrompt.id })
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


      <div className='wrapper'>
        
        <div className='word-container'>
          {
            words.map((word, i) => {
              return <span key={i}>{word} </span>
            })
          }
        </div>
        
         <div className='story-container'>
          {
            story.map((submission, i) => {
              return <div key={submission.id}>{submission.text}</div>
            })
          }
        </div>

        <div className='post-submission'>
          
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

        </div>
        <div className='posts-container'>
          {
            posts.map((post) => {
              return <Post key={post.id} text={post}/>
            })
          }
        </div>

      </div>
    </div>
  )
};

export default Homepage