import React from 'react';
import UpVote from './UpVote.jsx'

const Post = ({text}) => {

  return (
    <div className="text-container">
      <div className="upvote-container">
       </div>
        <div className='text-context'>  
      <p>{text.text}</p>
      <UpVote text={text}/>
    </div>
    </div>
  )
}

export default Post;