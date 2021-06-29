const request = require("request");
const cheerio = require("cheerio");
const allMatches = require("./allMatches");
const fs = require("fs");
const path = require("path");

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595", function(error, response, html){
    if(error){
        console.log(error);
    }else{
        handleRequest(html);
    }
})

let filePath = path.join(__dirname, "ipl");
dirCreator(filePath);



function handleRequest(html){
    let $ = cheerio.load(html);  // let's load the html to the cheerio
    let link = $('a[data-hover="View All Results"]').attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    console.log(fullLink);
    // fullLink is the link for all the result for all the matches

    // now I have to move to the new page where I have all the match result
    // so again i will request node to do that so

    request(fullLink , function(error, response, nextPageHtml){
        if(error){
            console.log(error);
        }else{
            allMatches.allMatches(nextPageHtml);
        }
    })

}

function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}