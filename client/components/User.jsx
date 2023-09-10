import React, {useState} from 'react';
import axios from 'axios';

const User = () => {

  const [userTexts, setUserTexts] = useState(
    ['antman received an award', 
  'black panther was exalted to ruler', 
  'captain america is in danger', 
  'daredevil fell in love', 
  'ego is a living planet',
  'falcon is the real captain america',
  'groot is the best guardian']);

  //axios get to retrieve all texts
  axios.get('http://localhost:8080/text', {
  })
    .then((texts) =>{
      setUserTexts(texts);
    })
    .catch((err) => {
      console.error('Could not retrieve texts!!', err);
    });
    

    const sample = ['antman received an award', 
    'black panther was exalted to ruler', 
    'captain america is in danger', 
    'daredevil fell in love', 
    'ego is a living planet',
    'falcon is the real captain america',
    'groot is the best guardian'];
    console.log(userTexts);
  return (
    <div className='user' >
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
