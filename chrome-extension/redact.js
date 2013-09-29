console.log(options);
compose = $('div[aria-label="Message Body"]');
console.log("original: " + compose.text);
trimmed = compose.text().replace(/^\s+|\s+$/g, '');
tokens = trimmed.split(' ');
punct = /(.*?)[.,!?:;/]$/g;

// config based on options
replacement = "+";
if (options.redactionStyle == "blackout")
    replacement = "<span style='background-color: black; color: black;'>[redacted]</span>";

lookup = top10k;
if (options.distCutoff == "5k")
    lookup = top5k;
else if (options.distCutoff == "1k")
    lookup = top1k;

//var processed = commonWords(tokens, lookup, replacement);
var message_text = compose.text();
var abstractifyAPI = "http://127.0.0.1:5000/abstractify";

$.post(abstractifyAPI, {text: message_text},
       function(data) {
          var processed = data;
           finish(processed);
       }, "text");

function finish(processed) {
    console.log(processed);
    trimmed = processed.replace(/^\s+|\s+$/g, '');
    console.log(trimmed);
    tokens = trimmed.split(' ');
    console.log(tokens);
    final_message = commonWords(tokens, lookup, replacement);
    console.log(final_message);
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
