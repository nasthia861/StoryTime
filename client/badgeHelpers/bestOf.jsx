//sets winner
const bestOf = (array, comp, key) => {  
  array.reduce((acc, current) => {
    //if there is already a tie
    if (acc.length > 1){
      if(current[comp] > acc[0][comp]){
        acc = [current];
        return acc;
      }
    }
    //for ties
    if (current[comp] === acc[comp]){
      acc.push(current);
      return acc;
    }
    if (current[comp] > acc[comp]) {
      acc = [current];
      return acc;
    }
  }, [])
    .then((bestText) => {
      this.setState({
        [key]: bestText
      })
    })
    .catch((error) => {
      console.error(`could not set winner for ${key}`, error);
    });
};
module.exports = bestOf;