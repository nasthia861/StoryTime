import axios from'axios';

//sets winner of prompt
const bestOf = (array) => {  
 return new Promise((resolve, reject) => {
  console.log('bestof', array);
   resolve(array.reduce((acc, current) => {
     //if there is already a tie
     if(current.likes > acc.likes){
       acc = current;
       return acc;
     }
     if (current.likes <= acc.likes) {
       return acc;
     }
   }))
 })
};

const mostContribution = (array) => {
  return new Promise((resolve, reject) => {
    let subUserObj = {}
    array.forEach((submission) => {
      if(subUserObj[submission.userId]) {
        subUserObj[submission.userId] = subUserObj[submission.userId]+1
      } else {
        subUserObj[submission.userId] = 1
      }
    })
    resolve(Object.entries(subUserObj).reduce((acc, current) => {
      if(current[1] > acc[1]){
        acc = current;
      }
      if(current[1] === acc[1]){
        if(current[0] !== acc[0]){
          acc = acc.concat(current);
        }
      }
      //console.log('acc', acc)
      return acc;
    }))
  })
}

const bestMatched = (array) => {
  return new Promise((resolve, reject) => {
    let userWordCt = {}  
    array.forEach((submission) => {
      let matchWordsArr = submission.prompt.matchWords.split(' ');
      let textArr = submission.text.split(' ');
      let wordMatchCt = matchWordsArr.filter(word => textArr.includes(word)).length
      if(userWordCt[submission.userId]) {
        userWordCt[submission.userId] = userWordCt[submission.userId] + wordMatchCt
      } else {
        userWordCt[submission.userId] = wordMatchCt
      }
    })
    resolve(Object.entries(userWordCt).reduce((acc, current) => {
      if(current[1] > acc[1]){
        acc = current;
      }
      if(current[1] === acc[1]){
        if(current[0] !== acc[0]){
          acc = acc.concat(current);
        }
      }
      return acc;
    }))
  })
}

  //picks submission with most likes and makes it part of the main story
  const promptWinner = (promptId) => {
    return new Promise((resolve, reject) => {

      //grab texts with the current promptId
      axios.get(`/text/prompt/${promptId}`)
      .then((textArr) => {
        //runs through function to determine submission with most likes
        bestOf(textArr.data)
        .then((best) => {
          //changes the winning state in the text db
          axios.post(`/text/winner/${best.id}`)
          //rerenders story to show new text
          resolve(best);
          // setStory((story) => ([...story, best]));
        })
      })
      .catch((error) => {
        console.error('no posts submitted', error);
      })
    })
  }

const awardCeremony = (storyId) => {
  return new Promise((resolve, reject) => {

    //grab all winning submissions
    console.log('Welcome to award show #', storyId)
  resolve(axios.get(`/text/winner/1/${storyId}`)
    //pass them through function that checks for most overall likes
    .then((textArr) => {
      console.log('contestants', textArr)
      //send badge to user that owns text with overall most likes
      bestOf(textArr.data)
        .then((text) => {
          console.log('for most overall likes', text)
          axios.post(`/user/badges/${text.userId}`, { badge: 'Likeable' })
            .catch(console.error('could not post to user badges'))
          //update badges info in db to include user info of winners
          axios.post(`/badges/${storyId}/mostLikes`, { newValue: text.userId})
            .catch(console.error('could not update badges for story'))
        })
      //send badge to user/s that made the most contributions
      mostContribution(textArr.data)
      //send badge to user/s
        .then((winnerArr) => {
          console.log('for best contributor/s [id, contribution count]', winnerArr);
          //single winner
          if(winnerArr.length === 2){
              axios.post(`/user/badges/${winnerArr[0]}`, { badge: 'Contributor' })
              .catch(console.error('could not post to user badges'))
              //update badges info in db to include user info of winners
              axios.post(`/badges/${storyId}/mostContributions`, { newValue: winnerArr[0]})
                .catch(console.error('could not post to user badges'))
                //multiple winners
              } else if (winnerArr.length > 2) {
                let multipleWinnersId = ''
                for(let x = 0; x < winnerArr.length; x+=2){
                  axios.post(`/user/badges/${winnerArr[x]}`, { badge: 'Contributor' })
                  .catch(console.error('could not post to user badges'))
                  multipleWinnersId += `${winnerArr[x]}...`
                }
                //update badges info in db to include user info of winners
                axios.post(`/badges/${storyId}/mostContributions`, { newValue: multipleWinnersId})
                .catch(console.error('could not post to user badges'))
              }
            })
            //pass them through function that checks for most matched words
            bestMatched(textArr.data)
            //send badge to user/s that owns winning text/s
            .then((winnerArr) => {
              console.log('for best word matcher/s [id, word match count]', winnerArr);
              //single winner
              if(winnerArr.length === 2){
              axios.post(`/user/badges/${winnerArr[0]}`, { badge: 'Matcher' })
                .catch(console.error('could not post to user badges'))
              //update badges info in db to include user info of winners
              axios.post(`/badges/${storyId}/mostWordMatchCt`, { newValue: winnerArr[0]})
                .catch(console.error('could not post to user badges'))
          //multiple winners
          } else if (winnerArr.length > 2) {
            let multipleWinnersId = ''
            for(let x = 0; x < winnerArr.length; x+=2){
              axios.post(`/user/badges/${winnerArr[x]}`, { badge: 'Matcher' })
                .catch(console.error('could not post to user badges'))
                multipleWinnersId += `${winnerArr[x]}...`
              }
              //update badges info in db to include user info of winners
              axios.post(`/badges/${storyId}/mostWordMatchCt `, { newValue: multipleWinnersId})
              .catch(console.error('could not post to user badges'))
            }
          })
    })
    .catch((error) => console.error('failed to grab all winning submissions', error))
    //   //update badges info in db to include user info of winners
  )})
}


export {promptWinner, awardCeremony}