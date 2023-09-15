import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userId, setUserId] = useState(1);
  const [userTexts, setUserTexts] = useState([]);
  const [userBadges, setUserBadges] = useState('');
  const  [username, setUsername] = useState('yeauxDejuan');
  const [badgeId, setBadgeId] = useState(1)

 
  const getUserId = (username) => {
    axios.get(`/user/${username}`)
      .then((userData) => {
       const user = userData.data[0];
          setUserId(user.id);
          setUserBadges(user.badges);
      })
      .catch((err) => {
        console.error('Could not retrieve user ID', err)
      });
  };
 
  //axios request to retrieve user texts by id
  const getStoryWithResponse = (id, badgeId) => {
    axios.get(`http://127.0.0.1:8080/text/winner/${id}/${badgeId}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  };

  useEffect(() => {
    getUserId(username)
    getStoryWithResponse(userId, badgeId);
  }, [username, badgeId]); // dependency array prevents constant rendering, syncs with state 
  //console.log(userTexts)

  return (
    <div>
      <nav>
        <Link to='/home' >
          <button className='user-home-button'>HomePage</button>
        </Link>
      </nav>
        <h1 className='user-head'>MY STORIES</h1>
      <div className='user' >
          <div className='user-data'>
            <ul className='user-ul'>
        {userTexts.map((entry, index) => {
            return (
              <div key={entry.id} className='user-entry-box'>
                <Link
                  to={`/user/text/${entry.id}`}
                  className='user-index'
                  entry={entry}
                >
                  <div>
                    <strong>Story:</strong> {entry.prompt.matchWords}
                  </div>
                  <div>
                    <strong>Response:</strong> {entry.text}
                  </div>
                </Link>
              </div>
            );
          })}

            </ul>
          </div>
      </div>
      <h1 className='badges-header' >Badges</h1>
      <div className='user-badges'>{userBadges}</div>
    </div>
  )
}

export default User;
