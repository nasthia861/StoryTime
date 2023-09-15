import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userId, setUserId] = useState();
  const [userTexts, setUserTexts] = useState([]);
  const [userBadges, setUserBadges] = useState({likeable: 0, contributor: 0, wordsMatcher: 0});
  const  [username, setUsername] = useState('thirduser');

 
  const getUserId = (username) => {
    axios.get(`/user/${username}`)
      .then((userData) => {
        userData.data.forEach(element => {
          setUserId(element.id);
          setUserBadges(element.badges);
          element.badges.split('+').forEach((badge) => {
            switch(badge) {
              case 'likeable':
                return setUserBadges(userBadges.likeable += 1);
              case 'contributor': 
                return setUserBadges(userBadges.contributor += 1);
              case 'wordsMatcher':
                return setUserBadges(userBadges.wordsMatcher += 1);
            }
          })
        });
      })
      .catch((err) => {
        console.error('Could not retrieve user ID', err)
      });
  };
 
  //axios request to retrieve user texts by id
  const getUserTexts = (id) => {
    axios.get(`http://127.0.0.1:8080/text/user/${id}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  };

  useEffect(() => {
    getUserId(username)
    getUserTexts(userId);
  });

  return (
    <div>
      <nav>
        <Link to='/home' >
          <button className='user-home-button'>HomePage</button>
        </Link>
      </nav>
        <h1 className='user-head' >MY STORIES</h1>
      <div className='user' >
          <div className='user-data'>
            <ul className='user-ul'>
        {
          userTexts.map((entry) => {
            return <Link
             to={`/user/text/${entry.id}`}
            className='user-index'
            entry={entry}
            key={entry.id}>
              <div>
                <strong> Response:</strong> {entry.text}
              </div>
              <div>
              <strong> Prompt:</strong> {entry.text}
              </div>

               {/* {entry.text} */}

            </Link>
          })
        }

            </ul>
          </div>
      </div>
      <h1 className='badges-header' >Badges</h1>
      <div className='user-badges'>
        {
          Object.entries(userBadges).map((category, i) => {
            if(category[1] > 0) {
              return <div className='beginner-badge' id={i} text={category[0]} />
            }
            if(category[1] > 5) {
              return <div className='advanced-badge' id={i} text={category[0]} />
            }
            if(category[1] > 10) {
              return <div className='master-badge' id={i} text={category[0]} />
            }
          })
        }
      </div>
    </div>
  )
}

export default User;
