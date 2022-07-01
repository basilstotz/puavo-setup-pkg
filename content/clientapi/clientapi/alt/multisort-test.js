// From https://stackoverflow.com/a/15668310/769326
const data = [
  {total: 20, name: 'David', age: 20},
  {total: 10, name: 'Joe', age: 35},
  {total: 15, name: 'Tracy', age: 18},
  {total: 20, name: 'Joel', age: 25},
  {total: 15, name: 'Michael', age: 40},
  {total: 10, name: 'Arnold', age: 35},
  {total: 15, name: 'Paul', age: 64},
];

//console.log('sorted by age (desc), name (asc), total (desc):', multiSort(data, {age: 'desc', name: 'asc', total: 'desc'}));
console.log('sorted by age (desc), name (asc), total (desc):\n', multiSort(data, {name: 'asc', total: 'desc'}));

/**
* Sorts an array of objects by column/property.
* @param {Array} array - The array of objects.
* @param {object} sortObject - The object that contains the sort order keys with directions (asc/desc). e.g. { age: 'desc', name: 'asc' }
* @returns {Array} The sorted array.
*/
function multiSort(array, sortObject = {}) {
  const sortKeys = Object.keys(sortObject);
  
  // Return array if no sort object is supplied.
  if (!sortKeys.length) {
    return array;
  }
  
  // Change the values of the sortObject keys to -1, 0, or 1.
  for (let key in sortObject) {
    sortObject[key] = sortObject[key] === 'desc' || sortObject[key] === -1 ? -1
                      : (sortObject[key] === 'skip' || sortObject[key] === 0 ? 0 : 1);
  }
  
  const keySort = (a, b, direction) => {
    direction = direction !== null ? direction : 1;
    
    if (a === b) { // If the values are the same, do not switch positions.
      return 0;
    }
    
    // If b > a, multiply by -1 to get the reverse direction.
    return a > b ? direction : -1 * direction;
  };
  
  return array.sort((a, b) => {
    let sorted = 0;
    let index = 0;
    
    // Loop until sorted (-1 or 1) or until the sort keys have been processed.
    while (sorted === 0 && index < sortKeys.length) {
      const key = sortKeys[index];
      
      if (key) {
        const direction = sortObject[key];
        
        sorted = keySort(a[key], b[key], direction);
        index++;
      }
    }
    
    return sorted;
  });
}
