// Show the selected options
console.log(options);
// Get message element
var compose = $('div[aria-label="Message Body"]');
// Show original message
console.log("original: " + compose.text);

// config based on options
var replacement = "+";
if (options.redactionStyle == "blackout")
    replacement =
    "<span style='background-color: black; color: black;'>[redacted]</span>";

var lookup = top10k;
if (options.distCutoff == "5k")
    lookup = top5k;
else if (options.distCutoff == "1k")
    lookup = top1k;

var message_text = compose.text();
var html_message = compose.html();
var abstractifyAPI = "http://127.0.0.1:5000/abstractify";

var trimmed = compose.text().replace(/^\s+|\s+$/g, '');
var tokens = trimmed.split(' ');
var localTransforms = commonWords(tokens, lookup, replacement);

// Process message with abstractify server
$.post(abstractifyAPI, {text: message_text},
       function(data) {
          var serverTransforms = data;
          var transforms = $.extend(true, {}, serverTransforms, localTransforms);
          console.log(serverTransforms);
          console.log(localTransforms);
          console.log(transforms);
          finish(transforms, html_message);
       }, "json");

function finish(transformations, html_message) {
    var processed = html_message;
    $.each(transformations, function(i, val) {
        processed = processed.replace(i, val);
    });

    compose.html(processed);
}

function commonWords(tokens, lookup, replacement) {
    var transformations = {};

    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i].toLowerCase();

        // Found a match
        if (lookup[t] != null) {
            if (options.redactEntire == "yes")
                transformations[tokens[i]] = replacement;
            else
                transformations[tokens[i]] = tokens[i].substring(0,3)
                + replacement;
        }
    }

    return transformations;
}
