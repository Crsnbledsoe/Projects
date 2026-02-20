const lunches = [];
function addLuncToEnd (arr,string)
  {
    arr.push(string);
    console.log('${string} added to the end of the lunch menu');
    return arr;
  };

function addLunchToStart (arr, string)
{
arr.unshift(string);
console.log('${string} added to the start of the lunch menu.');
return arr;
};

function removeLastLunch (arr)
  {
    if (arr.length === 0)
      console.log("No Lunches to Remove");
arr.pop();
console.log('${arr[-1]} removed from the end of the lunch menu.')
  };