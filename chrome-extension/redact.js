// Show the selected options
console.log(options);

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
var abstractifyAPI = "http://127.0.0.1:5000/abstractify";


$('div[aria-label="Message Body"]').each(function (i, compose_element) {
    // Convert into Jquery object
    var jcompose_element = $(compose_element);
    var message_text = jcompose_element.text();
    var trimmed = message_text.replace(/^\s+|\s+$/g, '');
    var tokens = trimmed.split(' ');
    var localTransforms = commonWords(tokens, lookup, replacement);

    // Process message with abstractify server
    $.post(abstractifyAPI, {text: message_text},
           function(data) {
               var serverTransforms = data;
               var transforms = $.extend(true, {}, serverTransforms,
                                         localTransforms);
               finish(serverTransforms, jcompose_element);
           }, "json");
});

function finish(transformations, compose_element) {
    var processed = compose_element.html();
    $.each(transformations, function(regularWord, vagueWord) {
        processed = processed.replace(regularWord, vagueWord);
    });

    compose_element.html(processed);
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
                transformations[tokens[i]] = tokens[i].substring(0,2)
                + replacement;
        }
    }

    return transformations;
}
