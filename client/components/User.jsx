import react, {useState} from 'react';
import axios from 'axios';

const User = () => {

  const [userTexts, setUserTexts] = useState([]);
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

  axios.get('http://127.0.0.1:8080/text', {
    params: {
      user_Id: userId
    }
  })

    const sample = ['antman received an award', 
    'black panther was exalted to ruler', 
    'captain america is in danger', 
    'daredevil fell in love', 
    'ego is a living planet',
    'falcon is the real captain america',
    'groot is the best guardian'];

  return (
    <div>
        <h1 className='user-head' >My Stories</h1>
      <div className='user-data'>
        <ul className='user-ul'>
        {
          sample.map((entry, index) => {
           return <li className='user-index' key={`${entry} ${index}`}>{entry}</li>
          })
        }

        </ul>
      </div>
    </div>
  )
}
export default User;
