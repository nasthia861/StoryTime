import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userId, setUserId] = useState(1);
  const [userTexts, setUserTexts] = useState([]);
  const [userBadges, setUserBadges] = useState('');

  //axios request to retrieve user texts by id
  
  const getUserTexts = (id) => {
    axios.get(`http://127.0.0.1:8080/text/user/${id}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });

  return (
    <div>
      <Link to='/' >
        <button className='user-home-button'>HomePage</button>
      </Link>
      <div className='user' >
        <h1 className='user-head' >MY STORIES</h1>
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
      <div className='user-badges'>{userBadges}</div>
    </div>
  )
}
export default User;
