// Begin once we receive our preferences
self.port.on("preferences", function(prefs) {

    // Get email message content
    var iframe = $('iframe'); // or some other selector to get the iframe
    var compose = $('div[aria-label="Message Body"]', iframe.contents());
    // var compose = $('div[aria-label="Message Body"]');

    // Save preferences
    var sp = prefs;

    alert("original: " + compose.text);
    self.port.emit('processMessage', { content: compose.text });

    // Wait for message to be processed
    self.port.on("processed", function(message) {
        var trimmed = message.replace(/^\s+|\s+$/g, '');
        var tokens = trimmed.split(' ');
        var punct = /(.*?)[.,!?:;/]$/g;

        // config based on prefs
        var replacement = "+";
        if (sp.prefs.redactionStyle == "blackout")
            replacement = "<span style='background-color: black; color: black;'>[redacted]</span>";

        var lookup = top10k;
        if (sp.prefs.distCutoff == "5k")
            lookup = top5k;
        else if (sp.prefs.distCutoff == "1k")
            lookup = top1k;

        compose.html(message);
        //var processed = commonWords(tokens, lookup, replacement);
        // var processed = compose.text();
        // var abstractifyAPI = "http://127.0.0.1:5000/abstractify";

        // $.post(abstractifyAPI, {text: processed},
        //        function(data) {
        //            compose.html(data);
        //        }, "text");

    });

});

function commonWords(tokens, lookup, replacement) {
    ret = "";

    for (var i=0; i<tokens.length; i++) {
        t = tokens[i].toLowerCase();
        match = punct.exec(t);
        if (match != null) t = match[1];
        if (lookup[t])
            ret += tokens[i];
        else {
            if (sp.prefs.redactEntire == "yes")
                ret += replacement;
            else
                ret += tokens[i].substring(0,1) + replacement;
        }
        ret += " ";
    }

    return ret;
}
