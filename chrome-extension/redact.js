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

var abstractifyAPI = "http://127.0.0.1:5000/";
var abstractify = abstractifyAPI + "abstractify";
var progress = abstractifyAPI + "get_progress";

var progressBarHTML =
    '<div class="vagueify-msg" style="text-align:center; font-weight:bold;"> \
    Vaguefying message…</div> \
    <div class="lpb" style="width=100%;"> \
    <div id="lpt" class="vprogress"style="width: 10%;"> \
    </div></div>';

// Process all messages
$('div[aria-label="Message Body"]').each(function (i, compose_element) {
    // Convert into Jquery object
    var jcompose_element = $(compose_element);
    var message_text = jcompose_element.text();
    var trimmed = message_text.replace(/^\s+|\s+$/g, '');
    var tokens = trimmed.split(' ');
    var localTransforms = commonWords(tokens, lookup, replacement);

    // Append a progress bar
    jcompose_element.prepend(progressBarHTML);

    var timeout = null;
    function poll() {
        $.ajax({
            url: progress,
            type: "GET",
            success: function(data) {
                console.log("polling");
                console.log(data.progress);
                $(".vprogress").css({ "width": data.progress + '%'});
            },
            dataType: "json",
            complete: timeout = setTimeout(function() {poll();}, 5000),
            timeout: 500
        });
    }

    // Start polling when Ajax fires up
    $(document).ajaxStart(poll);

    // Process message with abstractify server
    $.post(abstractify, {text: message_text},
           function(data) {
               $(".lpb").hide(); // hide the progress bar
               $(".vagueify-msg").hide(); // hide progress bar title message
               clearTimeout(timeout);
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
