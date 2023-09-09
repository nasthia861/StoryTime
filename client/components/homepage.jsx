import React, {useState, useEffect} from 'react';
import axios from'axios';

function Homepage() {
  const [words, setWords] = useState(['alleviate', 'run', 'no', 'why', 'infallible'])

  // useEffect(() => {
  //   axios.get('/api/words')
  //   .then(response => {
  //     setWords(response.data)
  //   })
  //   .catch(err => {
  //     console.error('Error getting words:', err)
  //   })
  // }, [])

  return (
    <div className='word-container'>
      {words.map((word, i) => (
        <span key={i}>{word } </span>
      ))}
    </div>
  )
};

export default Homepage