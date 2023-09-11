import React from 'react';
import UpVote from './UpVote.jsx'

const Post = ({text}) => {

  return (
    <div>
      <p>{text.text}</p>
      <UpVote
      textId={text.id}
      initialLikes={text.likes}
      initialDislikes={text.dislikes}
      />
    </div>
  )
}

export default Post;