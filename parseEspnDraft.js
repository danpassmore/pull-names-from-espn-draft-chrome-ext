/* globals $, chrome */

console.log('Starting Content Script!');

var num = 0;
var picksElement;

function getPicksFromElement()
{
  var picks = [];
  var tableBody = picksElement.firstChild.firstChild;
  var tableRows = tableBody.children;
  var pickRows;
  for(var i = 0; i < tableRows.length; i++)
  {
    var tableCols = tableRows[i].children;
    for(var j = 0; j < tableCols.length; j++)
    {
      var roundTable = tableCols[j].firstChild;
      pickRows = roundTable.firstChild.querySelectorAll("tr.picksSummaryRow");
      for(var k = 0; k < pickRows.length; k++)
      {
        var playerStr = pickRows[k].children[1].textContent;
        var playerPos = "";
        var playerName = "";
        var playerTeam = "";
        if(playerStr.trim().split("").length > 0)
        {
          playerPos = playerStr.split(", ")[1].split(" ")[1].trim();
          playerName = playerStr.split(", ")[0].trim();
          playerTeam = playerStr.split(", ")[1].split(" ")[0].trim();
        }

        picks[picks.length] = {
          pickNum: pickRows[k].children[0].textContent,
          player: {
            name: playerName,
            pos: playerPos,
            team: playerTeam
          }
        };
      }
    }
  }

  return [pickRows.length, picks];
}

function sendDataToExtension()
{
  var numOwners = getPicksFromElement()[0];
  var playerPicks = getPicksFromElement()[1];

  var message = {
    type: "picksUpdate",
    data: {
      nOwners: numOwners,
      picks: playerPicks
    }
  };

  console.log("sending message:");
  console.log(message);

  chrome.runtime.sendMessage(message, function(response){});
}


function onPick(mutations)
{
  num=num+1;
  mutations.forEach(function(mutation) {
    console.log("mutation #"+num, mutation.type);
  });

  sendDataToExtension();
}



function main()
{
  console.log('Starting MAIN!');

  picksElement = document.getElementById('roundView');

  if (picksElement)
  {
    console.log('Found required elements');

    sendDataToExtension();

    // create an observer instance
    var observer = new MutationObserver(onPick);

    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true, subtree: true };

    // pass in the target node, as well as the observer options
    observer.observe(picksElement, config);
  }
  else
  {
    console.log('Failed to find "picksElement" in Content Script!');
  }
}

$( document ).ready(main);
