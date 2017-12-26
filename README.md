# Cryptogram
A simple cryptogram website

Try it out:
https://joshuaj004.github.io/Cryptogram/index.html

# Tech Stack
## Front End
The front end is a simple HTML5+CSS3+Javascript website. No ~~bloated~~ fancy frameworks at the moment.

## Backend
The backend is a pretty straight-forward Python program with Flask acting as a server. I am using [Zappa](https://github.com/Miserlou/Zappa) to go #Serverless and I deployed the backend to AWS Lambda where it can run 1 million times for free.
There was no extra steps for converting my Flask server to work on lambda, so that was a nice change.

## Quotes
The quotes are grabbed from https://talaikis.com/random_quotes_api/ 

I didn't have to sign up for an API key and there aren't any limits or anything like that. I would highly recommend this website as a source for random quotes!

# Features (Not guaranteed to be up to date)
* Serverless backend
* Pulls in a random quote from a source containing over 70,000+ quotes, so you probably won't see the same quote twice
* Lets you know if you've duplicated a letter
* Free, no ads!
* You can give up and see the answer!
* Feedback is provided if you got the author/the quote/both/neither correct

# Design Justifications
**Why deploy it to lambda when this is something that could be done clientside?**

I wanted to get some experience with 'serverless' and I figured that if I convert this into an app, it might be easier to have a backend to hit rather than having to re-write it.

**Why not use a framework?**

I think it is far to much overhead for a simple website and this was going to be a static page anyways (I wasn't interested in hosting this on anything but github pages).

**Where's the jQuery?**

I'll modify the code later to use more jquery because I feel that jQuery is quite a bit more readable (sometimes) than vanilla javascript. 
