import react, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'

const User = () => {

  const [userTexts, setUserTexts] = useState([]);
  const [userId, setUserId] = useState(1);
  // axios.get(`http://127.0.0.1:8080/users`, {
  //   params :{
  //     id
  //   }
  // })
  //   .then((userData)=> {
  //     setUser(userData)
  //   })
  //   .catch((err) => {
  //     console.error('Could not retrieve user', err);
  //   });
  useEffect(() => {
    axios.get(`http://127.0.0.1:8080/text/${userId}`)
    .then((texts) =>{
      setUserTexts(texts.data);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
  })
    
    // const sample = ['antman received an award', 
    // 'black panther was exalted to ruler', 
    // 'captain america is in danger', 
    // 'daredevil fell in love', 
    // 'ego is a living planet',
    // 'falcon is the real captain america',
    // 'groot is the best guardian'];

  return (
    <div>
      <Link to='/'>
        <button>HomePage</button>
      </Link>
      <div className='user' >
        <h1 className='user-head' >My Stories</h1>
          <div className='user-data'>
            <ul className='user-ul'>
        {
          userTexts.map((entry, index) => {
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
    </div>
  )
}
export default User;
