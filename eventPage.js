var menuItem = {
    "id": "addProtein",
    "title": "Add Protein",
    "contexts":["selection"]
}

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function (clickData) {



    if (clickData.menuItemId == "addProtein" && clickData.selectionText) {


        chrome.identity.getAuthToken({ 'interactive': true }, function(token) {


            if (chrome.runtime.lastError) {
                alert('token error')
            } else {
                alert('token \t'+ token)
            }



            // Use the token.
            var timestamp = new Date().getTime();
            var id = 'myid' + timestamp;
            var opt1 = {
                type: "basic",
                title: "Note!",
                message: token,
                iconUrl: "icon.png"
            }
            chrome.notifications.create(id, opt1, function () { });
        });


        var intRegex = /^\d+$/;
        if (intRegex.test(clickData.selectionText)) {
            chrome.storage.sync.get('total', function (items) {
                var newTotal = 0;
                if (items.total) {
                    newTotal += parseInt(items.total);
                }

                newTotal += parseInt(clickData.selectionText);
                chrome.storage.sync.set({ 'total': newTotal });
            });
        }


        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/notes/save", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        var data = {
                   	"pageUrl":clickData.pageUrl,
                   	"note": clickData.selectionText
                   }

        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            // do some logging here
          }
        }
        xhr.send();





    }
});

chrome.storage.onChanged.addListener(function (changes) {
    chrome.browserAction.setBadgeText({ "text": changes.total.newValue.toString() });
});

