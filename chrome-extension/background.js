"use strict";

// Open options page when clicking extension icon
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({url: "options.html"});
});

// Fetch options and send them to content script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        var options = {redactionStyle: localStorage['redactionStyle'],
                       redactEntire: localStorage['redactEntire'],
                       distCutoff: localStorage['distCutoff']}

        if (request.method == "vagueify") {
            sendResponse({options: options});
        }
    });
