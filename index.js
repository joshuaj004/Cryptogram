QUOTES_URL = 'http://localhost:5000/'
LAMBDA_URL = "https://qk5fq1j6i8.execute-api.us-west-2.amazonaws.com/production"
guessedLetters = [];
response = {};
uppercaseASCII = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function createLetterButtons() {
    for (var c = 0; c < uppercaseASCII.length; c++) {
        var divWrapper = document.createElement("div");
        divWrapper.className = "input-group";
        divWrapper.className += " characterInput";
        var innerSpan = document.createElement("span");
        innerSpan.className = "input-group-addon";
        innerSpan.innerHTML = uppercaseASCII[c];
        var innerInput = document.createElement("input");
        innerInput.class = "form-control";
        innerInput.type = "text";
        innerInput.setAttribute("maxlength", "1");
        innerInput.oninput = letterButtonOnInput(uppercaseASCII[c]);
        innerInput.id = uppercaseASCII[c];
        divWrapper.appendChild(innerSpan);
        divWrapper.appendChild(innerInput);
        document.getElementById("characterInputs").appendChild(divWrapper);
    }
}
createLetterButtons();


function letterButtonOnInput(origLetter) {
    return function() {
        var newValue = document.getElementById(origLetter).value;
        // It's basically sanitized input, right?
        if (!/^[a-zA-Z]*$/g.test(newValue)) {
            document.getElementById(origLetter).value = "";
            return;
        }
        var quoteIndices = getQuoteIndices(origLetter);
        var authorIndices = getAuthorIndices(origLetter);
        if (newValue == "") {
            newValue = "*";
        }
        newValue = newValue.toUpperCase();
        if (uppercaseASCII.indexOf(newValue) > -1) {
            var guessedLetters = getGuessedLetters();
            if (guessedLetters.includes(newValue)) {
                document.getElementById(origLetter).classList.add('text-danger');
            } else {
                document.getElementById(origLetter).classList.remove('text-danger');
            }
        } else {
            document.getElementById(origLetter).classList.remove('text-danger');
        }
        var decryptedQuote = document.getElementById("decryptedQuote").innerHTML;
        var decryptedAuthor = document.getElementById("decryptedAuthor").innerHTML;
        for (var i = 0; i < quoteIndices.length; i++) {
            decryptedQuote = replaceString(decryptedQuote, newValue, quoteIndices[i]);
        }
        for (var i = 0; i < authorIndices.length; i++) {
            decryptedAuthor = replaceString(decryptedAuthor, newValue, authorIndices[i]);
        }
        document.getElementById("decryptedQuote").innerHTML = decryptedQuote;
        document.getElementById("decryptedAuthor").innerHTML = decryptedAuthor;
    }
}


function getGuessedLetters() {
    var guessedLetters = [];
    var duplicates = [];
    for (var c = 0; c < uppercaseASCII.length; c++) {
        var letter = document.getElementById(uppercaseASCII[c]).value.toUpperCase();
        if (letter == "") {
            continue;
        }
        if (uppercaseASCII.indexOf(letter) > -1) {
            if (guessedLetters.indexOf(letter) > -1) {
                duplicates.push(letter);
            } else {
                guessedLetters.push(letter);
            }            
        }
    }
    return duplicates;
}


function replaceString(string, char, index) {
    var s = string.substr(0, index) + char + string.substr(index + 1);
    return s;
}


function getStringIndices(type, letter) {
    indices = [];
    var encryptedString = response[type];
    for (var i = 0; i < encryptedString.length; i++) {
        if (encryptedString[i] == letter) {
            indices.push(i);
        }
    }
    return indices;
}


function getAuthorIndices(origLetter) {
    return getStringIndices("author" , origLetter);
}


function getQuoteIndices(origLetter) {
    return getStringIndices("quote" , origLetter);
}


function processQuote() {
    document.getElementById("encryptedQuote").innerHTML = response["quote"];
    document.getElementById("encryptedAuthor").innerHTML = response["author"];
    formatDecryptedQuote(response["quote"], response["author"]);
}


function getQuote() {
    resetAllValues();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            response = JSON.parse(xmlHttp.responseText)
            processQuote();
        }
    }
    xmlHttp.open("GET", LAMBDA_URL, true); // true for asynchronous
    xmlHttp.send(null);
}
getQuote();


function formatDecryptedQuote(quote, author) {
    var newQuote = quote.replace(/[a-zA-Z]/g, "*");
    var newAuthor = author.replace(/[a-zA-Z]/g, "*");
    document.getElementById("decryptedQuote").innerHTML = newQuote;
    document.getElementById("decryptedAuthor").innerHTML = newAuthor;
}


function giveUp() {
    document.getElementById("decryptedQuote").innerHTML = response["decryptedQuote"];
    document.getElementById("decryptedAuthor").innerHTML = response["decryptedAuthor"];
}


function resetAllValues() {
  $('.characterInput').find('input:text').val('');
}


function checkCorrect() {
    if (document.getElementById("decryptedQuote").innerHTML == response["decryptedQuote"] 
        && document.getElementById("decryptedAuthor").innerHTML == response["decryptedAuthor"]) {
        swal(
            'Good job!',
            'Both are correct!',
            'success'
        );
    } else if (document.getElementById("decryptedQuote").innerHTML == response["decryptedQuote"]) {
        swal(
            'Close!',
            'The quote is correct, but the author isn\'t!',
            'info'
        );
    } else if (document.getElementById("decryptedAuthor").innerHTML == response["decryptedAuthor"]) {
        swal(
            'Close!',
            'The author is correct, but the quote isn\'t!',
            'info'
        );
    } else {
        swal(
            'Keep Trying!',
            'Neither the author nor the quote is correct!',
            'warning'
        );
    }
}