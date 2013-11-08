#!/bin/bash

install_nth () {
    get_dependencies
}

check_download() {
    if ! [ $? -eq 0 ]
    then
        printf "$RED A fatal error occurred during the Nothing to Hide installation. Aborting..."
        exit 1
    fi
}

get_dependencies () {

    printf " Fetching all dependencies...\n$RESET"
    cd /tmp # move to temp dir

    # Get latest code from the repo
    $DOWNLOAD_CMD $NTH_URL
    check_download
    IFS='/' read -ra DIRS <<< "$NTH_URL"
    LAST_PART=${DIRS[${#DIRS[@]} - 1]}
    unzip $LAST_PART

    mv nothing-to-hide-master "$NTH_INSTALL_DIR" # Move to install director

    # Move to server directory
    cd "$NTH_INSTALL_DIR/abstractor-server"

    # Get the latest Stanford Tagger
    $DOWNLOAD_CMD $POSTAGGER_URL
    check_download
    IFS='/' read -ra DIRS <<< "$POSTAGGER_URL"
    LAST_PART=${DIRS[${#DIRS[@]} - 1]}
    unzip $LAST_PART
    rm $LAST_PART # Cleanup

    # Get the latest Stanford Named Entity Recognizer
    $DOWNLOAD_CMD $NER_URL
    check_download
    IFS='/' read -ra DIRS <<< "$NER_URL"
    LAST_PART=${DIRS[${#DIRS[@]} - 1]}
    unzip $LAST_PART
    rm $LAST_PART # Cleanup

    # Get extra necessary NLTK dependencies
    python -m nltk.downloader punkt
    check_download

    # Get Python dependencies
    pip install --user ner flask
    check_download
}

colors () {
    # Reset
    RESET='\e[0m'
    RED='\e[0;31m' # Red
    GREEN='\e[0;32m' # Green
    YELLOW='\e[0;33m' # Yellow
    BLUE='\e[0;34m' # Blue
    PURPLE='\e[0;35m' # Purple
    CYAN='\e[0;36m' # Cyan
    WHITE='\e[0;37m' # White

    # Bold
    BRED='\e[1;31m' # Red
    BGREEN='\e[1;32m' # Green
    BYELLOW='\e[1;33m' # Yellow
    BBLUE='\e[1;34m' # Blue
    BPURPLE='\e[1;35m' # Purple
    BCYAN='\e[1;36m' # Cyan
    BWHITE='\e[1;37m' # White
}

# Commandline args:
# -d/--directory [dir]
# Install nothing-to-hide into the specified directory. If 'dir' is a relative path prefix it with $HOME.
# Defaults to '$HOME/nothing-to-hide'
# -c/--colors
# Enable colors
# -s/--source [url]
# Fetch nothing-to-hide from 'url'.
# Defaults to 'https://github.com/climatewarrior/nothing-to-hide/archive/master.zip'
# -h/--help
# Print help
# -v/--verbose
# Verbose output, for debugging

usage() {
    printf "Usage: $0 [OPTION]\n"
    printf " -c, --colors \t \t \t Enable colors.\n"
    printf " -d, --directory [dir] \t Install nothing-to-hide into the specified directory.\n"
    printf " \t \t \t \t If 'dir' is a relative path prefix with $HOME.\n"
    printf " \t \t \t \t Defaults to $HOME/.emacs.d\n"
    printf " -s, --source [url] \t \t Get nothing-to-hide from 'url'.\n"
    printf " \t \t \t \t Defaults to 'https://github.com/climatewarrior/nothing-to-hide/archive/master.zip'.\n"
    printf " -h, --help \t \t \t Display this help and exit\n"
    printf " -v, --verbose \t \t Display verbose information\n"
    printf "\n"
}

### Parse cli
while [ $# -gt 0 ]
do
    case $1 in
        -d | --directory)
            NTH_INSTALL_DIR=$2
            shift 2
            ;;
        -c | --colors)
            colors
            shift 1
            ;;
        -s | --source)
            NTH_URL=$2
            shift 2
            ;;
        -h | --help)
            usage
            exit 0
            ;;
        -v | --verbose)
            echo "nth verbose $NTH_VERBOSE"
            NTH_VERBOSE='true';
            shift 1
            ;;
        *)
            printf "Unkown option: $1\n"
            shift 1
            ;;
    esac
done

POSTAGGER_URL="http://nlp.stanford.edu/software/stanford-postagger-2013-06-20.zip"
NER_URL="http://nlp.stanford.edu/software/stanford-ner-2013-06-20.zip"

[ -z $NTH_URL ] && NTH_URL="https://github.com/climatewarrior/nothing-to-hide/archive/master.zip"
[ -z "$NTH_INSTALL_DIR" ] && NTH_INSTALL_DIR="$HOME/nothing-to-hide"

### Check dependencies
printf "$CYAN Checking to see if curl or wget are installed... $RESET"
if hash curl 2>&-
then
    printf "$GREEN found.$RESET\n"
    DOWNLOAD_CMD="curl -LOk"
elif hash wget 2>&-
then
    printf "$GREEN found.$RESET\n"
    DOWNLOAD_CMD="wget"
else
    printf "$RED not found. Aborting installation!$RESET\n"
    exit 1
fi;

printf "$CYAN Checking to see if Python is installed... "
if hash python 2>&-
then
    printf "$GREEN found.$RESET\n"
else
    printf "$RED not found. Aborting installation!$RESET\n"
    exit 1
fi

printf "$CYAN Checking to see if pip is installed... "
if hash pip 2>&-
then
    printf "$GREEN found.$RESET\n"
else
    printf "$RED not found. Aborting installation!$RESET\n"
    exit 1
fi

printf "$CYAN Checking to see if Java is installed... "
if hash java 2>&-
then
    printf "$GREEN found.$RESET\n"
else
    printf "$RED not found. Aborting installation!$RESET\n"
    exit 1
fi

install_nth
