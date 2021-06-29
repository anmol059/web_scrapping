const request = require("request");
const cheerio = require("cheerio");
const perMatchDetails = require("./allDetails");



function allMatches(html) {
    
    const $ = cheerio.load(html);
    let allMatchesArr = $('a[data-hover = "Scorecard"]');
    
    for(let i = 0; i < allMatchesArr.length; i++){
        let link = $(allMatchesArr[i]).attr("href");
        console.log(link);
        let fullLink = "https://www.espncricinfo.com/" + link;
        // console.log(fullLink);
        request(fullLink , function(error, response, perPageHtml){
            if(error){
                console.log(error);
            }else{
                perMatchDetails.allDetails(perPageHtml);
            }
        })
    }
}

module.exports = {
    allMatches: allMatches
}

