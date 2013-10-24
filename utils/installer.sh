install_vagueify () {
    printf " Cloning the Prelude's GitHub repository...\n$RESET"
    if [ x$VAGUEIFY_VERBOSE != x ]
    then
        /usr/bin/env git clone $VAGUEIFY_URL "$VAGUEIFY_INSTALL_DIR"
    else
        /usr/bin/env git clone $VAGUEIFY_URL "$VAGUEIFY_INSTALL_DIR" > /dev/null
    fi
    if ! [ $? -eq 0 ]
    then
        printf "$RED A fatal error occurred during Prelude's installation. Aborting..."
        exit 1
    fi
}

make_vagueify_dirs () {
    printf " Making the required directories.\n$RESET"
    mkdir -p "$VAGUEIFY_INSTALL_DIR/vendor" "$VAGUEIFY_INSTALL_DIR/personal"
    mkdir -p "$VAGUEIFY_INSTALL_DIR/themes"
    mkdir -p "$VAGUEIFY_INSTALL_DIR/savefile"
}

get_dependencies () {
    # Get the latest Stanford Tagger
    $DOWNLOAD_CMD "http://nlp.stanford.edu/software/stanford-postagger-2013-06-20.zip"
    # Get the latest Stanford Named Entity Recognizer
    $DOWNLOAD_CMD "http://nlp.stanford.edu/software/stanford-ner-2013-06-20.zip"
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
# Install prelude into the specified directory. If 'dir' is a relative path prefix it with $HOME.
# Defaults to '$HOME/nothing-to-hide'
# -c/--colors
# Enable colors
# -s/--source [url]
# Clone prelude from 'url'.
# Defaults to 'https://github.com/climatewarrior/nothing-to-hide.git'
# -h/--help
# Print help
# -v/--verbose
# Verbose output, for debugging

usage() {
    printf "Usage: $0 [OPTION]\n"
    printf " -c, --colors \t \t \t Enable colors.\n"
    printf " -d, --directory [dir] \t Install prelude into the specified directory.\n"
    printf " \t \t \t \t If 'dir' is a relative path prefix with $HOME.\n"
    printf " \t \t \t \t Defaults to $HOME/.emacs.d\n"
    printf " -s, --source [url] \t \t Clone prelude from 'url'.\n"
    printf " \t \t \t \t Defaults to 'https://github.com/climatewarrior/nothing-to-hide.git'.\n"
    printf " -h, --help \t \t \t Display this help and exit\n"
    printf " -v, --verbose \t \t Display verbose information\n"
    printf "\n"
}

### Parse cli
while [ $# -gt 0 ]
do
    case $1 in
        -d | --directory)
            VAGUEIFY_INSTALL_DIR=$2
            shift 2
            ;;
        -c | --colors)
            colors
            shift 1
            ;;
        -s | --source)
            VAGUEIFY_URL=$2
            shift 2
            ;;
        -h | --help)
            usage
            exit 0
            ;;
        -v | --verbose)
            echo "prelude verbose $VAGUEIFY_VERBOSE"
            VAGUEIFY_VERBOSE='true';
            shift 1
            ;;
        *)
            printf "Unkown option: $1\n"
            shift 1
            ;;
    esac
done

[ -z $VAGUEIFY_URL ] && VAGUEIFY_URL="https://github.com/climatewarrior/nothing-to-hide.git"
[ -z "$VAGUEIFY_INSTALL_DIR" ] && VAGUEIFY_INSTALL_DIR="$HOME/nothing-to-hide"

### Check dependencies
printf "$CYAN Checking to see if curl or wget are installed... $RESET"
if hash curl 2>&-
then
    printf "$GREEN found.$RESET\n"
    DOWNLOAD_CMD="curl -C - -O"
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

printf "$CYAN Checking to see if Java is installed... "
if hash java 2>&-
then
    printf "$GREEN found.$RESET\n"
else
    printf "$RED not found. Aborting installation!$RESET\n"
    exit 1
fi
