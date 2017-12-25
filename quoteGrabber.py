from flask import Flask, jsonify

app = Flask(__name__)
import requests, json, re, string, random, html
__author__ = 'Josh'
# QUOTES_URL = 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1'
QUOTES_URL = 'https://talaikis.com/api/quotes/random/'


def main():
    quoteInfo = getQuote()
    strippedQuote = stripQuote(html.unescape(quoteInfo['quote']))
    shiftsDict = generateShifts()
    shiftedQuote = shiftQuote(strippedQuote, shiftsDict)
    shiftedAuthor = shiftAuthor(quoteInfo['author'].upper(), shiftsDict)
    print(shiftedQuote)
    print(shiftedAuthor)
    input("Solution?")
    print(strippedQuote)
    print(quoteInfo['author'].upper())


@app.route('/')
def api():
    quoteInfo = getQuote()
    strippedQuote = stripQuote(html.unescape(quoteInfo['quote']))
    print(strippedQuote)
    print(quoteInfo['author'].upper())
    shiftsDict = generateShifts()
    shiftedQuote = shiftQuote(strippedQuote, shiftsDict)
    shiftedAuthor = shiftAuthor(quoteInfo['author'].upper(), shiftsDict)
    quoteDict = {}
    quoteDict["author"] = shiftedAuthor
    quoteDict["quote"] = shiftedQuote
    quoteDict["decryptedAuthor"] = quoteInfo['author'].upper()
    quoteDict["decryptedQuote"] = strippedQuote
    response = jsonify(quoteDict)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def shiftString(string, shiftsDict):
    shiftedString = ""
    for c in string:
        if c in shiftsDict:
            shiftedString += shiftsDict[c]
        else:
            shiftedString += c
    return shiftedString


def shiftAuthor(author, shiftsDict):
    return shiftString(author, shiftsDict)


def shiftQuote(quote, shiftsDict):
    return shiftString(quote, shiftsDict)


def generateShifts():
    shiftsDict = {}
    outputList = list(string.ascii_uppercase)
    random.shuffle(outputList)
    for letter in string.ascii_uppercase:
        randomLetter = outputList.pop()
        while letter == randomLetter:
            outputList.append(randomLetter)
            random.shuffle(outputList)
            randomLetter = outputList.pop()
        shiftsDict[letter] = randomLetter
    return shiftsDict


def stripQuote(quote):
    return re.sub('<[^<]+?>', '', quote).strip().upper()

def getQuote():
    r = requests.get(QUOTES_URL)
    return json.loads(r.text)


if __name__ == '__main__':
    main()

