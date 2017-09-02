
console.log('\nStarting popup.js!\n');

function renderStatus(data) {
    var htmlblock = "<table>";
    var i = 0;
    for(; i < data.picks.length; i++)
    {
      if(data.picks[i].player.name.length == 0)
      {
        break;
      }
    }

    for(i--; i >= 0; i--)
    {
      htmlblock += "<tr>";
      htmlblock += "<td>" + data.picks[i].pickNum + "</td>";
      htmlblock += "<td>" + data.picks[i].player.name + "</td>";
      htmlblock += "<td>" + data.picks[i].player.pos + "</td>";
      htmlblock += "<td>" + data.picks[i].player.team + "</td>";
      htmlblock += "</tr>"; 
    }
    htmlblock += "</table>";

  document.getElementById('status').innerHTML = htmlblock;
  //document.getElementById('status').innerHTML = data;
}

function refreshPopup()
{
  console.log('popup.js: Sending request message');
  var message = {
    type: "popupDataReq"
  };
  document.getElementById('status').innerHTML = "Getting data from draft window...";
  chrome.runtime.sendMessage(message, function(response){
    console.log('popup.js: Received Response');
    console.log(response);
    if(response.popupData)
    {
      renderStatus(response.popupData);
    }
    else
    {
      document.getElementById('status').innerHTML = "No data available yet";
    }
  });
}



function main()
{
  chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse)
    {
      if(message.type == "picksUpdate")
      {
        refreshPopup();
      }
    });
  refreshPopup();
}

document.addEventListener('DOMContentLoaded', main);
