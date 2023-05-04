const {Octokit} = require("@octokit/core");


const octokit = new Octokit ({
  auth: `token ${process.env.GITHUB_TOKEN}`,
  userAgent: '461npm v1.2.3',
  baseUrl: 'https://api.github.com',
});


export async function get_code_review_score(repo_url: string): Promise<number> {
  //this is the raw github repo url
  //it is assumed that this github url is a valid url and just points to the root directory

  //converts it to correct GET request format
  //ex: https://api.github.com/repos/cloudinary/cloudinary_npm/pulls
  let fullLine:string = "https://api.github.com/repos"
  var result = repo_url.substring(repo_url.lastIndexOf("github.com") + 10);
  fullLine = fullLine + result + "/pulls";
//   console.log(repo_url);
//   console.log(fullLine)

  let score = 0;
  
  score = await code_review_score_calculator(fullLine);
  //globalThis.logger.info(`license status for ${repo_url}`);

  return score;
}


export async function code_review_score_calculator(requestURL: string): Promise<number>
 {
  let totalScore = 0;
  //console.log("got inside of here");
  let requestCommand:string = "GET " + requestURL;
  try {
    const prs = await octokit.request(requestCommand, {
      state: 'closed',  
      per_page: 99,
    });

    //console.log(prs);

    let totalCodeReview = 0;
    let numGoodCodeReview = 0;
   
    //alternate way to itterate through the data
    //   for (var data in prs.data) {
    //     console.log("Key:" + data);
    //     console.log("Value:" + prs[data]);
    // }

    //the api only gets the closed pull requets. Out of this the if statement ensures only pull requests that were merged are analyzed.
    prs.data.forEach((element: { merged_at: any; assignees: string | any[]; requested_reviewers: string | any[]; requested_teams: string | any[]; labels: string | any[]; }) => {
      
      
      if(element.merged_at){
        totalCodeReview = totalCodeReview + 1;
        if(element.assignees.length != 0 || element.requested_reviewers.length != 0 || element.requested_teams.length != 0 || element.labels.length != 0){
          //console.log("Follows at least some sort of proper code review process");
          numGoodCodeReview = numGoodCodeReview + 1;
        }
        // else{
        //   console.log("Does not follow proper code review process");
        // }
      }
      
      
    });
    if(totalCodeReview != 0){
      totalScore = numGoodCodeReview / totalCodeReview;
    }
    else{
      totalScore = 1;
    }
    // console.log("totalCodeReview: " + totalCodeReview);
    // console.log("numGoodReview: " + numGoodCodeReview);
    // console.log("total score: " + totalScore);       
  }
  catch (error) {
      console.log("the requested package url does not exist")
      console.error(error)
      return 0; 
  }

  return totalScore;

 }


// async function main() {
//   //https://api.github.com/repos/cloudinary/cloudinary_npm/pulls
//   //let url_parse = "https://github.com/alex-page/pizza";
//   //let url_parse = "https://github.com/karma-runner/karma";
//   //let url_parse = "https://github.com/axios/axios"
//   //let url_parse = "https://github.com/lodash/lodash"
//   let url_parse = "https://github.com/expressjs/express"
//   //let url_parse = "https://github.com/davisjam/safe-regex"
//   //let url_parse = "https://github.com/prettier/prettier"

//   //console.log("starting");
//   const code_review_score = await get_code_review_score(url_parse);
//   console.log(" \n\n ")
//   const version_pining_score = await get_version_pinning_score(url_parse);
  
//   console.log(code_review_score);
//   console.log(version_pining_score);
// }

// main();