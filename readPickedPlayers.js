
console.log('Starting Content Script!');

var num = 0;
var element;

function onPick(mutations)
{
  mutations.forEach(function(mutation) {
    console.log(mutation.type);
  });
  num=num+1;
  console.log('Done with mutation' + num.toString());

  var message = {
    type: "picksUpdate",
    data: element.innerHTML
  };
  chrome.runtime.sendMessage(message, function(response){}); 
}


function main()
{

  console.log('Starting MAIN!');

  //var element = document.getElementById('picksTableTBody');
  element = document.getElementById('picksTable');
 
  if (element)
  {
    console.log('Found element!!');
    var message = {
      type: "picksUpdate",
      data: element.innerHTML
    };
    chrome.runtime.sendMessage(message, function(response){}); 

    // create an observer instance
    var observer = new MutationObserver(onPick);

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree: true };

    // pass in the target node, as well as the observer options
    observer.observe(element, config);
  }
  else
  {
    console.log('Failed to find "element" in Content Script!');
  }

}
// later, you can stop observing
//observer.disconnect();

$( document ).ready(main);
