const request = require("request");
const cheerio = require('cheerio');
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";
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
    let conArr = $(".match-info.match-info-MATCH .name");
    let winnerName = $(conArr[1]).text();
    console.log(winnerName);
    let maxWicketTaker = "";
    let maxWicket = 0;
    let lessConArr = $(".card.content-block.match-scorecard-table .Collapsible");
    let currHtml = "";
    for(let i = 0; i < lessConArr.length; i++){
        let indhtml = $(lessConArr[i]).html();
        currHtml += indhtml;
        let headingArr = $(lessConArr[i]).find(".header-title.label");
        let heading = $(headingArr[0]).text();
        let isWinnerArr = heading.split("INNINGS");
        let isWinner = isWinnerArr[0].trim();
        if(isWinner === winnerName){
            console.log(isWinner);
            let bowlerArr = $(lessConArr[i]).find(".table.bowler tbody tr");
            for(let j = 0; j < bowlerArr.length; j++){
                let allCol = $(bowlerArr[j]).find("td");
                let playerName = $(allCol[0]).text();
                let wickets = $(allCol[4]).text();
                if(wickets > maxWicket){
                    maxWicketTaker = playerName;
                    maxWicket = wickets;
                }
            }
        }
    }
    
    console.log(maxWicketTaker);
    console.log(maxWicket);


}