import React, { useState } from 'react';
import axios from 'axios';


const UpVote = ({initLikes, initDislikes}) => {
  //hook to initialize like count and increment
  const [likes, setLikes] = useState(initLikes);
  //hook to initialize dislike count and decrement
  const [dislikes, setDislikes] = useState(initDislikes);
  const handleLikes = () => {
    axios.post(`/text/${text.id}`, { action: 'likes'})
    .then((textObj) => {
      if (textObj.status === 200) {
        setLikes(likes + 1);
      }
    })
    .catch((err) => console.error('Error trying to like:', err))

  };
  const handleDislikes = () => {
    axios.post('/text')
  };
  return (
    <div>
      <button>onClick={handleLikes}❤️‍🔥🔥</button>
        <span>Likes: {likes}</span>
        <button>onClick={handleDislikes}🗑️🚮</button>
        <span>Likes: {dislikes}</span>
    </div>
  )



}
export default UpVote;