import React, { useState } from 'react';


const UpVote = ({initLikes, initDislikes}) => {
  //hook to initialize like count and increment
  const [likes, setLikes] = useState(initLikes);
  //hook to initialize dislike count and decrement
  const [dislikes, setDislikes] = useState(initDislikes);
  const handleLikes = () => {
  };
  const handleDislikes = () => {
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

export default UpVote