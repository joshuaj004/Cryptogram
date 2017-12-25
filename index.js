console.log("We're live here");
QUOTES_URL1 = 'https://talaikis.com/api/quotes/random/'
QUOTES_URL = 'http://localhost:5000/'
LAMBDA_URL = "https://qk5fq1j6i8.execute-api.us-west-2.amazonaws.com/production"
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
        innerInput.onchange = letterButtonOnClick(uppercaseASCII[c]);
        innerInput.id = uppercaseASCII[c];
        divWrapper.appendChild(innerSpan);
        divWrapper.appendChild(innerInput);
        document.getElementById("characterInputs").appendChild(divWrapper);
    }
}
createLetterButtons();


function letterButtonOnClick(origLetter) {
    return function() {
        var newValue = document.getElementById(origLetter).value;
        var quoteIndices = getQuoteIndices(origLetter);
        var authorIndices = getAuthorIndices(origLetter);
        if (newValue == "") {
            newValue = "*";
        }
        newValue = newValue.toUpperCase();
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


function replaceString(string, char, index) {
    var s = string.substr(0, index) + char + string.substr(index + 1);
    return s;
}


function getAuthorIndices(origLetter) {
    var indices = [];
    var encryptedAuthor = response["author"];
    for (var i = 0; i < encryptedAuthor.length; i++) {
        if (encryptedAuthor[i] == origLetter) {
            indices.push(i);
        }
    }
    return indices;
}


function getQuoteIndices(origLetter) {
    var indices = [];
    var encryptedQuote = response["quote"];
    for (var i = 0; i < encryptedQuote.length; i++) {
        if (encryptedQuote[i] == origLetter) {
            indices.push(i);
        }
    }
    return indices;
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