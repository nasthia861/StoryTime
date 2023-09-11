import React, {useState, useEffect} from 'react';
import axios from 'axios';
import UpVote from './UpVote.jsx';

const Text = ({textId}) => {
  
  const [text, setText] = useState('');

  useEffect(() => {

    axios.get(`/text/${textId.id}`)
    axios.get(`/text/${textId.id}`)
    .then((textData) => {
      setText(textData.text);
    })
    .catch((err) => console.error(`Error getting text:${err}`))
  }, [textId])


  return (
    <div> 
      <p>{text}</p>
      <UpVote textId={textId}/>
    </div>
  )
}
export default Text;