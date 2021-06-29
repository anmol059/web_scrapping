const request = require("request");
const cheerio = require('cheerio');
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/ball-by-ball-commentary";
request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log("error: ", error);
    } else {
        handleHTML(html);
    }
}
function handleHTML(html) {
    let $ = cheerio.load(html);
    let conArr = $('.match-comment-long-text');
    let text = $(conArr[1]).text();
    // let htmlData = $(conArr[1]).html();
    console.log(text);
    // console.log(htmlData);

}