# Nothing to Hide
![Demo](https://raw.github.com/compsocial/nothing-to-hide/master/recorded.gif)

Nothing to Hide is a Chrome extension for Gmail that makes your email messages vaguer. After you compose a message, Nothing to Hide replaces any overly specific words and phrases with appropriate, but much vaguer alternatives. The intended recipient can (hopefully) still understand the transformed message but snoopers (hopefully) cannot. Part experiment, part art project, Nothing to Hide wants to let you communicate with people you already know while simultaneously hiding your text in the background noise of the internet. In other words, Nothing to Hide seeks to confound user mining and user modeling because some of the most telling information was never written down.

**This project is its very early stages of development. On rare occasions, it might tele-transport your computer to the event horizon. Also, due to its reliance on natural language processing toolkits, this version only supports the English language, sorry :(**

If you are interested in being part of the academic experiment on this
project, send email to Eric Gilbert at gilbert@cc.[georgia tech's
domain].

## The Problem
Email, like many forms of CMC, [is not particularly private.](https://en.wikipedia.org/wiki/Email_security#Privacy_concerns) Public-key, cryptographic technologies such as [GPG](https://en.wikipedia.org/wiki/GNU_Privacy_Guard) offer great security. But methods like GPG require all parties to have and understand the technology, and have failed to gather widespread traction. Nothing to Hide tries an orthogonal and socially-inspired approach to privacy, *vagueness*.

## This Solution 
We'll be writing more here, but essentially it depends on the [Google 1T
corpus](http://catalog.ldc.upenn.edu/LDC2006T13) and [well-known natural language processing tools](http://nlp.stanford.edu/software/index.shtml).

## Installation

First install our [Chrome extension](https://chrome.google.com/webstore/detail/nothing-to-hide/keiegjchmoggjbpgfjdjghbiicpjneoe). Also, you need the following installed:

-   [Java](http://openjdk.java.net/) (Only tested with Java 1.6 and higher)
-   [Python](http://python.org/) (Only tested with Python 2.6.x and higher)
-   [pip](https://pypi.python.org/pypi/pip/) (Only tested with 1.4.x and higher) How to install pip on
      [Windows](http://stackoverflow.com/questions/4750806/how-to-install-pip-on-windows) and [Mac OS X.](http://docs.python-guide.org/en/latest/starting/install/osx/) Ubuntu users run `sudo apt-get install python-pip`.

### Automated
The automated method has only been tested in GNU/Linux and Mac OS
X. It should work for other \*nixes. Windows users have to use the manual method.

####  Via Curl
If using `curl` type the following command:
```bash
curl -L https://raw.github.com/climatewarrior/nothing-to-hide/master/utils/installer.sh | bash
```
#### Via Wget
If you prefer `wget` type:
```bash
wget --no-check-certificate https://raw.github.com/climatewarrior/nothing-to-hide/master/utils/installer.sh -O - | bash
```

### Manual
1. Download the latest [Stanford NER](http://nlp.stanford.edu/software/CRF-NER.shtml)
2. Download the latest [Stanford Postagger](http://nlp.stanford.edu/software/tagger.shtml)
3. Get extra NTLK dependencies `python -m nltk.downloader punkt`
4. Install Flask and Pyner `pip install flask ner`
5. Get the [latest version of our code](https://github.com/climatewarrior/nothing-to-hide/archive/master.zip)
6. Uncompress Stanford NER and Stanford Postagger into the `abstractor-server` directory within Nothing to Hide.
7. See [run.sh](https://github.com/climatewarrior/nothing-to-hide/blob/master/utils/run.sh) to how to start your servers manually.

## How to use
1.  `cd` to the install directory, the default one is `~/nothing-to-hide`.
2.  Start the server with: `bash utils/run.sh`.
3.  Open Chrome or Chromium and open your Gmail account.
4.  Write your email messages as you normally would.
5.  Before sending them hit the VAGUE-IFY button below the compose button.
6.  Revise your messages. You can click on changed words to bring them to their original form.
7.  When you are happy with your changes, click Accept in the compose window.
8.  Shutdown the server whenever you wish or just leave it running in the background.

*Note: no data leaves your machine in our implementation.*

# Developer
## Contributing
Feel free to send out any pull requests or issues our way!
[Here's a simple guide](http://gun.io/blog/how-to-github-fork-branch-and-pull-request/)
on contributing to open source projects on Github.
## Contributors
Professor Eric Gilbert came up with the idea and the initial
implementation of Nothing to Hide. Gabriel J. Pérez Irizarry worked up
the initial implementation and brought it to its current status.
###  Dependencies
-   [Pyner](https://github.com/dat/pyner)
-   [Flask](http://flask.pocoo.org/)
-   [Stanford NER](https://github.com/dat/stanford-ner)
-   [Stanford Tagger](http://nlp.stanford.edu/software/tagger.shtml)
-   [NLTK](https://pypi.python.org/pypi/nltk/2.0.1)
