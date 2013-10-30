"use strict";

// Show the selected options
console.log(options);

// config based on options
var replacement = "+";
if (options.redactionStyle == "blackout")
    var replacement =
    "<span style='background-color: black; color: black;'>[redacted]</span>";

var lookup = top10k;
if (options.distCutoff == "5k")
    var lookup = top5k;
else if (options.distCutoff == "1k")
    var lookup = top1k;

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
var panes = $('div[role="dialog"]').toArray();
process(panes.pop());

function process (pane) {

    var jpane = $(pane) // Convert into Jquery object
    var compose_element = jpane.find('div[aria-label="Message Body"]');
    var message_text = compose_element.text();
    console.log("Original Message");
    console.log(message_text);
    var trimmed = message_text.replace(/^\s+|\s+$/g, '');
    console.log('Trimmed')
    console.log(trimmed)

    // Append a progress bar
    compose_element.prepend(progressBarHTML);

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
               var tokens = trimmed.split(/[\n ,]+/);
               console.log("Tokens");
               console.log(tokens);
               var localTransforms = commonWords(tokens, lookup, replacement);
               var transforms = $.extend(true, {}, localTransforms,
                                         serverTransforms);
               console.log("Local transforms");
               console.log(localTransforms);
               console.log("server transforms");
               console.log(serverTransforms);
               console.log("Transforms");
               console.log(transforms);
               finish(transforms, compose_element, jpane);
           }, "json");
};

function finish(transformations, compose_element, pane) {
    var processed = compose_element.html();

    // Add extra button for accepting changes
    pane.find('div[data-tooltip="Send ‪(Ctrl-Enter)‬"]').after(function() {
        return $(this).clone();
    });

    // Change new button text
    pane.find('div[data-tooltip="Send ‪(Ctrl-Enter)‬"]:eq(1)')
        .text('Accept').attr('data-tooltip', 'Accept changes');

    // Add callback to accept changes proposed
    pane.find('div[data-tooltip="Accept changes"]').click(function() {
        pane.find('div[aria-label="Message Body"]').find('span')
            .replaceWith(function() {
                // Replace with vague words, remove ☒ character
                $(this).replaceWith($(this).text().slice(0,-1));
            });
    });

    // Remove button copies, I don't know where they come from :/
    // pane.find('div[data-tooltip="Accept changes‬"]:gt(1)').remove();


    $.each(transformations, function(regularWord, vagueWord) {
        // We will replace words that the server has vague versions of with this
        var alt = '<span class="NQ" id="" aria-haspopup="true" data-tooltip='
            + regularWord + '>' + vagueWord + ' ☒</span>';

        // Process all the words with their alternatives
        processed = processed.replace(regularWord, alt);

    });

    // Add callback for all replaced words
    $('div[aria-label="Message Body"]')
        .delegate('span', 'click', function() {
            $(this).replaceWith($(this).attr('data-tooltip'));
        });

    // Put on new view with transformations
    compose_element.html(processed);

    // Get next pane, if there is one
    var next_pane = panes.pop();

    // Is there another pane?
    if (next_pane) {
        process(next_pane); // Process next pane
    }

}

function commonWords(tokens, lookup, replacement) {
    var transformations = {};

    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i].toLowerCase();

        var patt=/[^'a-zA-Z:]/;

        if (lookup[t] == null && t.length > 3 && !patt.test(t)) {
            if (options.redactEntire == "yes")
                transformations[tokens[i]] = replacement;
            else
                transformations[tokens[i]] = tokens[i].substring(0,2)
                + replacement;
        }
    }

    return transformations;
}
