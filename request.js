const request = require('request');
const cheerio = require('cheerio');
console.log("Before the request");
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard', cb);

console.log("After the asyn request");
function cb(error, response, html) {
    if (error) {
        console.error('error:', error); // Print the error if one occurred
    } else {
        handleRequest(html);
    }
}

function handleRequest(html) {
    let sel = cheerio.load(html);
    let conArr = sel('.best-player-name a[data-hover = "Trent Boult"]');
    console.log(sel(conArr[0]).text());

}