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
    console.log('about to hit resolve', subUserObj);
    resolve(Object.entries(subUserObj).reduce((acc, current) => {
      if(current[1] > acc[1]){
        acc = current;
      }
      if(current[1] === acc[1]){
        acc = acc.concat(current);
      }
      return acc;
    }))
  })
}

const bestMatched = (array) => {
  return new Promise((resolve, reject) => {
    resolve(array.map((submission) => {
      let matchWordsArr = submission.prompt.matchWords.split(' ');
      let textArr = submission.text.split(' ');
      let wordMatchCt = matchWordsArr.filter(word => textArr.includes(word)).length
      return [submission.userId, wordMatchCt];
    }).reduce((acc, current) => {
      if(current[1] > acc[1]){
        acc = current;
      }
      if(current[1] === acc[1]){
        acc = acc.concat(current);
      }
      return acc;
    }))
  })
}

export {bestOf, mostContribution, bestMatched}