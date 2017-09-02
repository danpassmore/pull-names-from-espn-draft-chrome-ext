/* globals chrome */


chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    'use strict';
    if(sender.tab)
    {
      // message is from some tab's event script
      console.log('enentPage.js: got a message from content script!');
      if (message.type === "picksUpdate")
      {
        var i = 0;
        for(; i < message.data.picks.length; i++)
        {
          if(message.data.picks[i].player.name.length === 0)
          {
            break;
          }
        }
        var curPickNum = i+1;

        localStorage.picksData = JSON.stringify(message.data);

        console.log('eventPage.js: picksUpdate!' + curPickNum.toString());
        chrome.browserAction.setBadgeText({text: curPickNum.toString()});
      }
    }
    else
    {
      // message is from chrome runtime context
      if (message.type === "popupDataReq")
      {
        if(localStorage.hasOwnProperty("picksData"))
        {
          var d = JSON.parse(localStorage.picksData);
          var response = {popupData: d};
          // response with data!
          console.log('eventPage.js: sending response to popupDataReq!');
          console.log(response);
          
          sendResponse(response);
        }
        else
        {
          // response with no data
          console.log('\neventPage.js: sending empty data response to popupDataReq!\n');
          sendResponse();
        }
      }
    }
  });

