import React, {useState, useEffect} from 'react';
import axios from 'axios';
import UpVote from './UpVote.jsx';

const Text = ({text}) => {
  console.log(text)
  
  const [prompt, setText] = useState('');

  useEffect(() => {

    axios.get(`/text/${text.id}`)
    .then((textData) => {
      setText(textData.data.text);
    })
    .catch((err) => console.error(`Error getting text:${err}`))
  }, [text])


  return (
    <div className="text-container">
      <div className="upvote-container">
       </div>
        <div className='text-context'>  
      <p>{prompt}</p>
      <UpVote text={text}/>
    </div>
    </div>
   
  )
}
export default Text;