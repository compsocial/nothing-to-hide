function toggleStyle(radioButton) {
  if (localStorage == null) {
    alert('Local storage is required for changing options');
    return;
  }
  if (document.getElementById('redact').checked) {
    localStorage.redactionStyle = "blackout";
  } else {
    localStorage.redactionStyle = "ellipsis";
  }
}

function toggleFirst(radioButton) {
  if (localStorage == null) {
    alert('Local storage is required for changing options');
    return;
  }
  if (document.getElementById('entire').checked) {
    localStorage.redactEntire = "yes";
  } else {
    localStorage.redactEntire = "no";
  }
}

function toggleDist(radioButton) {
  if (localStorage == null) {
    alert('Local storage is required for changing options');
    return;
  }
  if (document.getElementById('five').checked) {
    localStorage.distCutoff = "5k";
  } else if (document.getElementById('one').checked) {
    localStorage.distCutoff = "1k";
  } else {
    localStorage.distCutoff = "10k";
  }
}

function main() {
  if (localStorage == null) {
    alert("LocalStorage must be enabled for changing options.");
    document.getElementById('defaultellipsis').disabled = true;
    document.getElementById('redact').disabled = true;
    document.getElementById('defaultfirst').disabled = true;
    document.getElementById('entire').disabled = true;
    document.getElementById('defaultten').disabled = true;
    document.getElementById('five').disabled = true;
    document.getElementById('one').disabled = true;
    return;
  }

  // init options
  if (!localStorage.redactInitialized) {
    localStorage.redactInitialized = "yes";
    localStorage.redactionStyle = "ellipsis";
    localStorage.redactEntire = "no";
    localStorage.distCutoff = "10k";
  }

  // Default handler is checked. If we've chosen another provider, we must
  // change the checkmark.
  if (localStorage.redactionStyle == "blackout")
    document.getElementById('redact').checked = true;

  if (localStorage.redactEntire == "yes") 
    document.getElementById('entire').checked = true;

  if (localStorage.distCutoff == "5k")
    document.getElementById('five').checked = true;
  else if (localStorage.distCutoff == "1k")
    document.getElementById('one').checked = true;
}

document.addEventListener('DOMContentLoaded', function () {
  main();
  document.querySelector('#defaultellipsis').addEventListener('click', toggleStyle);
  document.querySelector('#redact').addEventListener('click', toggleStyle);
  document.querySelector('#defaultfirst').addEventListener('click', toggleFirst);
  document.querySelector('#entire').addEventListener('click', toggleFirst);
  document.querySelector('#defaultten').addEventListener('click', toggleDist);
  document.querySelector('#five').addEventListener('click', toggleDist);
  document.querySelector('#one').addEventListener('click', toggleDist);
});
