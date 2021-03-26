//require module
let request = require("request");
let cheerio = require("cheerio");
let fs = require('fs');
let path = require('path');

//Craete directoty of name IPL
var dir = 'C:/Users/hp/Desktop/WebScrapping Hw/activity/IPL2020';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    }
    else {
        ExactResultOfTeam(html);
    }
}

function ExactResultOfTeam(html) {
    let selectorTool = cheerio.load(html);
    let selectorElem = selectorTool(".label.blue-text.blue-on-hover");
    let allTeamResult = selectorTool(selectorElem[0]).attr("href");
    let allTeamResultLink = "https://www.espncricinfo.com" + allTeamResult;
    OpenAllTeamResultLink(allTeamResultLink);
}

function OpenAllTeamResultLink(allTeamResultLink) {
    request(allTeamResultLink, cb);
    function cb(error, response, html) {
        if (error) {
            console.log(error);
        }
        else {
            ExactScoreCard(html);
        }
    }
}

function ExactScoreCard(html) {
    let selectorTool = cheerio.load(html);
    let selectorElem = selectorTool(".btn.btn-sm.btn-outline-dark.match-cta");
    for (let i = 2; i < selectorElem.length; i = i + 4) {
        let ScorecardLink = selectorTool(selectorElem[i]).attr("href");
        let completeScorecardLink = "https://www.espncricinfo.com" + ScorecardLink;
        OpenScorecardLink(completeScorecardLink);
    }
}


function OpenScorecardLink(completeScorecardLink) {
    request(completeScorecardLink, cb);
    function cb(error, response, html) {
        if (error) {
            console.log(error);
        }
        else {
            ExactPlayerDetail(html);
        }
    }
}

function ExactPlayerDetail(html) {
    let selectorTool = cheerio.load(html);

    let selectorElem = selectorTool("p.name");
    let nameOfTeam = selectorTool(selectorElem[20]).text();
    nameOfTeam = nameOfTeam.trim();


    let info = selectorTool("div .description");
    let infoElem = selectorTool(info[10]).text();
    let dateArr = infoElem.split(",");
    let date = dateArr[2];
    date = date.trim();

    let venueArr = infoElem.split(",");
    let venue = venueArr[1];
    venue = venue.trim();

    let winTeamElem = selectorTool(".best-player-team-name");
    let winTeam = selectorTool(winTeamElem[0]).text();
    winTeam = winTeam.trim();

    let manOfMatchElem = selectorTool(".best-player-name");
    let manOfMatch = selectorTool(manOfMatchElem[0]).text();
    manOfMatch = manOfMatch.trim();

    let verifyTeamNameElem = selectorTool(".header-title.label");
    let VerifynameOfTeam = selectorTool(verifyTeamNameElem[0]).text();
    let VerifynameOfTeamArr = VerifynameOfTeam.split("INNINGS");
    let verifyTeamName = VerifynameOfTeamArr[0];
    verifyTeamName = verifyTeamName.trim();
    verifyTeamName = verifyTeamName.toLowerCase();

    let arr = [];
    let batsmenTable = selectorTool(".table.batsman");
    for (let i = 0; i < batsmenTable.length; i++) {
        let singleInningBat = selectorTool(batsmenTable[i]).find("tbody tr");
        for (let j = 0; j < singleInningBat.length; j = j + 2) {
            let singleAllCol = selectorTool(singleInningBat[j]).find("td");
            let name = selectorTool(singleAllCol[0]).text();
            name = name.trim();
            let run = selectorTool(singleAllCol[2]).text();
            run = run.trim();
            let ball = selectorTool(singleAllCol[3]).text();
            ball = ball.trim();
            let fours = selectorTool(singleAllCol[4]).text();
            fours = fours.trim();
            let sixs = selectorTool(singleAllCol[5]).text();
            sixs = sixs.trim();
            let sr = selectorTool(singleAllCol[6]).text();
            sr = sr.trim();

            arr.push(
                {
                    "Name": name,
                    "Run": run,
                    "Ball": ball,
                    "Fours": fours,
                    "Sixes": sixs,
                    "SR": sr,
                    "Name of Team": nameOfTeam,
                    "Date": date,
                    "Venue": venue,
                    "Win Team": winTeam,
                    "Man Of Match": manOfMatch
                }
            )
            makeTeamNameFolder(nameOfTeam, name, arr);
        }
    }
}

//create directory of team name
function makeTeamNameFolder(nameOfTeam, name, arr) {
    var pathOfTeam = 'C:/Users/hp/Desktop/WebScrapping Hw/activity/IPL2020/' + nameOfTeam;
    if (!fs.existsSync(pathOfTeam)) {
        fs.mkdirSync(pathOfTeam);
    }
    makePlayerNameFile(pathOfTeam, name, arr);
}

//Make json file
function makePlayerNameFile(pathOfTeam, playerName, arr) {
    let pathoffile = pathOfTeam + "/" + playerName + ".json";
    if (!fs.existsSync(pathOfTeam)) {
        var createStream = fs.createWriteStream(pathoffile);
        createStream.end();
    }

    if (arr[0].Name == playerName) {
        fs.writeFileSync(pathoffile, JSON.stringify(arr));
    }
}




