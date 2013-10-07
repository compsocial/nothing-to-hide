chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "jquery-2.0.2.min.js"}, function() {
    chrome.tabs.executeScript(null,{file: "dict.js"}, function() {
        chrome.tabs.executeScript(null, {code: "var options = {redactionStyle:'"+localStorage.redactionStyle+"',redactEntire:'"+localStorage.redactEntire+"',distCutoff:'"+localStorage.distCutoff+"'};"}, function() {
        chrome.tabs.executeScript(null, {file: "redact.js"});
      });
    });
  });
});
