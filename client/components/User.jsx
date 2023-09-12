import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userId, setUserId] = useState(1);
  const [userTexts, setUserTexts] = useState([]);
  const [userBadges, setUserBadges] = useState('');

 
  const getUserId = (username) => {
    axios.get(`http://localhost:8080/user/${username}`)
      .then((userData) => {
        // setUserId(userData.data.id);
        // console.log(userData);
      })
      .catch((err) => {
        console.error('Could not retrieve user ID', err)
      });
  };
 
  //axios request to retrieve user texts by id
  const getUserTexts = (id) => {
    axios.get(`http://localhost:8080/text/user/${id}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  };
  
  const getUserBadges = (id) => {
    axios.get(`http://localhost:8080/user/${id}`)
    .then((userData) => {
      setUserBadges(userData.data.badges);
    })
    .catch((error) => {
      console.error('could not get user badges', error)
    });
  };

  useEffect(() => {
    getUserId('PhreezorBurn')
    getUserTexts(userId);
    getUserBadges(userId);
  });

  return (
    <div>
      <nav>
        <Link to='/' >
          <button className='user-home-button'>HomePage</button>
        </Link>
      </nav>
        <h1 className='user-head' >MY STORIES</h1>
      <div className='user' >
          <div className='user-data'>
            <ul className='user-ul'>
        {
          userTexts.map((entry) => {
            return <Link to="/user/text" 
            className='user-index' 
            entry={entry} 
            key={entry.id}> 
               {entry.text}
            </Link>
          })
        }

            </ul>
          </div>
      </div>
      <h1 className='badges-header' >Badges</h1>
      <div className='user-badges'>{userBadges}</div>
    </div>
  )
}

export default User;
