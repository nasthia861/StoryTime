import react, {useState} from 'react';
import axios from 'axios';

export default function User () {

  const [user, setUser] = useState({});
  axios.get(`http://127.0.0.1:8080/users`, {
    params :{
      id
    }
  })
    .then((userData)=> {
      setUser(userData)
    })
    .catch((err) => {
      console.error('Could not retrieve user', err);
    });

    const sample = [a, b, c, d, e, f, g];
  return (
    <div className='user'>
        {
          sample.map((entry, index) => {
           return <p key={entry + index}>{entry}</p>
          })
        }
    </div>
  )
}