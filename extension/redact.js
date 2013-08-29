console.log(options);
compose = $('div[aria-label="Compose reply"]');
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
compose.html(ret);
