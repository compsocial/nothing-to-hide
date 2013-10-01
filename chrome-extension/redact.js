console.log(options);
var compose = $('div[aria-label="Message Body"]');
console.log("original: " + compose.text);
var trimmed = compose.text().replace(/^\s+|\s+$/g, '');
var tokens = trimmed.split(' ');
var punct = /(.*?)[.,!?:;/]$/g;

// config based on options
var replacement = "+";
if (options.redactionStyle == "blackout")
    replacement = "<span style='background-color: black; color: black;'>[redacted]</span>";

var lookup = top10k;
if (options.distCutoff == "5k")
    lookup = top5k;
else if (options.distCutoff == "1k")
    lookup = top1k;

//var processed = commonWords(tokens, lookup, replacement);
var message_text = compose.text();
var html_message = compose.html();
var abstractifyAPI = "http://127.0.0.1:5000/abstractify";

$.post(abstractifyAPI, {text: message_text},
       function(data) {
          var transformations = data;
          finish(transformations, html_message);
       }, "json");

function finish(transformations, html_message) {
    var processed = html_message;
    $.each(transformations, function(i, val) {
        processed = processed.replace(i, val);
    });
    // var trimmed = processed.replace(/^\s+|\s+$/g, '');
    // var tokens = trimmed.split(' ');
    // var final_message = commonWords(tokens, lookup, replacement);
    compose.html(processed);
}

function commonWords(tokens, lookup, replacement) {
    var ret = "";
    var nltk_processed = /[A-Za-z]\[[a-z]\]/;

    for (var i=0; i<tokens.length; i++) {
        var t = tokens[i].toLowerCase();

        var match = punct.exec(t);
        if (match != null) t = match[1];
        if (lookup[t])
            ret += tokens[i];
        else {
            if (options.redactEntire == "yes")
                ret += replacement;
            else
                ret += tokens[i].substring(0,3) + replacement;
        }
        ret += " ";
    }

    return ret;
}
