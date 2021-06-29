const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");


//Read the excel file by converting into JSON
function excelReader(filePath, sheetName){
    if(fs.existsSync(filePath) == false){
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_add_json(excelData);
    return ans;
}


// write the excel file by converting json to sheets
function excelWriter(filePath, sheetName, json){
    let newWB = xlsx.utils.book_new();
    //json data excel format convert
    let newWS = xlsx.utils.json_to_sheet(json);
    // append the new worksheet to workBook
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    //  write into the work book
    xlsx.writeFile(newWB, filePath);
}

function handleRequest(html) {
    //venue
    //date
    //opponent
    //result
    //runs
    //balls
    //fours
    //sixes
    //sr
    const $ = cheerio.load(html);
    let result = $('.match-info.match-info-MATCH .status-text').text().trim();
    let descr = $('.match-info.match-info-MATCH .description').text().split(",");
    let venue = descr[1].trim();
    let date = descr[2].trim();
    // console.log(`Result  --------------> ${res}`);
    // console.log("venue   --------------> " + descr[1].trim());
    // console.log("Date    --------------> " + descr[2].trim());

    // Details like 
    //runs
    //balls
    //fours
    //sixes
    //sr

    // we need to segrigate the html first
    // let planeHtmlforDetails = "";
    let segHtml = $('.card.content-block.match-scorecard-table .Collapsible');


    for (let i = 0; i < segHtml.length; i++) {   // max length is 2.
        // planeHtmlforDetails += $(segHtml[i]);  // in order to get the planeHTML
        let heading = $(segHtml[i]).find('.header-title.label').text();

        let teamName = heading.split("INNINGS")[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;

        let heading2 = $(segHtml[opponentIndex]).find('.header-title.label').text();

        let opponentTeamName = heading2.split("INNINGS")[0].trim();
        // console.log(teamName + " vs " + opponentTeamName);

        let curInning = $(segHtml[i]);
        let allRows = curInning.find('.table.batsman tbody tr');

        console.log(`${venue}| ${date} |${teamName}| ${opponentTeamName} |${result}`);

        for(let j = 0; j < allRows.length; j++){
            let allCols = $(allRows[j]).find('td');
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");  // hasClass does not take .
            if(isWorthy == true){
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sr, opponentTeamName, venue, date, result);
            }
        }
    }

}

function processPlayer(teamName, playerName, runs, balls, fours, sr, opponentTeamName){
    let teamPath = path.join(__dirname, "ipl", teamName);
    if(fs.existsSync(teamPath) == false){
        dirCreator(teamPath);
    }
    let playerPath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(playerPath, playerName);
    let playerObj = {
        teamName,  //short-end for "teamName" : teamName
        playerName,
        runs,
        balls,
        fours,
        sr,
        opponentTeamName
        // venue,
        // date,
        // result
    }
    content.push(playerObj);
    excelWriter(playerPath, playerName, content);

}

function dirCreator(filePath){
    if(fs.existsSync(filePath) == false){
        fs.mkdirSync(filePath);
    }
}

module.exports = {
    allDetails: handleRequest
}
