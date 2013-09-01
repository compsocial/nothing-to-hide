console.log(options);
compose = $('div[aria-label="Message Body"]');
//console.log("original: " + compose.text());
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
var processed = compose.text();
var abstractifyAPI = "http://127.0.0.1:5000/abstractify";

$.post(abstractifyAPI, {text: processed},
       function(data) {
           compose.html(data);
       }, "text");

function commonWords(tokens, lookup, replacement) {
    ret = "";

    for (var i=0; i<tokens.length; i++) {
        t = tokens[i].toLowerCase();
        match = punct.exec(t);
        if (match != null) t = match[1];
        if (lookup[t])
            ret += tokens[i];
        else {
            if (options.redactEntire == "yes")
                ret += replacement;
            else
                ret += tokens[i].substring(0,1) + replacement;
        }
        ret += " ";
    }

    return ret;
}
