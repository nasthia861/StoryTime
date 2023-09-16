//sets winner of prompt
const bestOf = (array) => {  
 return new Promise((resolve, reject) => {
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

export {bestOf, mostContribution, bestMatched}