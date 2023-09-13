//sets winner
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
module.exports = bestOf;