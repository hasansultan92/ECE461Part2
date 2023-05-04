const {Octokit} = require("@octokit/core");
const { base64 } = require("base-64");


const octokit = new Octokit ({
    auth: `token ${process.env.GITHUB_TOKEN}`,
  userAgent: '461npm v1.2.3',
  baseUrl: 'https://api.github.com',
});

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');

export async function get_version_pinning_score(repo_url: string): Promise<number> {
  //this is the raw github repo url
  //it is assumed that this github url is a valid url and just points to the root directory

  //converts it to correct GET request format
  //ex: https://api.github.com/repos/alex-page/pizza/contents/package.json
  let fullLine:string = "https://api.github.com/repos"
  var result = repo_url.substring(repo_url.lastIndexOf("github.com") + 10);
  fullLine = fullLine + result + "/contents/package.json";
//   console.log(repo_url);
//   console.log(fullLine)

  let score = 0;

  score = await version_score_calculator(fullLine);
  //globalThis.logger.info(`license status for ${repo_url}`);

  return score;
}

export async function version_score_calculator(requestURL: string): Promise<number>
 {
  let totalScore = 0;
  
  let requestCommand:string = "GET " + requestURL;
  //console.log(requestCommand);
  try {
    const prs = await octokit.request(requestCommand, {
    });
    // console.log(prs);
    if(prs.data.content == null){
      console.log("no content field in the api GET request");
      return 0;
    }
    let decodedData = decode(prs.data.content);
    //console.log(decodedData)
    let jsonObject = JSON.parse(decodedData);
    if(jsonObject.dependencies == null){
      console.log("no dependencies field in the api GET request");
      return 1;
    }

    //console.log("\n\n\n\nNOW WE ARE HERE:")
    //console.log(jsonObject.dependencies)

    // for item in jsonObject.dependencies{
    //     console.log(item)
    // }
    //console.log("beginigngg");
    //~ are fine as long as they are at the begining (ie they match the regex below)
  

    //just cannot match ~X.0.0
    //goes as far right as it can
    const regexForIfNotPinnedTilde = new RegExp('^\~\d*[1-9]+\.0+\.0+');

    //just cannot match ^Y.X.X
    //goes as far left as it can
    const regexForIfNotPinnedCarrot = new RegExp("\\^\d*[1-9]+\.")
   
    //to check if it is valid and pinned
    //const regexForIfNotEither = new RegExp('\^|\~')
    const dependenciesSTUFFF = jsonObject.dependencies;
    const regexGeneralTest = new RegExp('^[0-9]+\.[0-9]+\.[0-9]+')
    let totalDependencies = 0;
    let numGoodDependencies = 0;
   
    

    // console.log("Carrot Test")
    // if(regexForIfNotPinnedCarrot.test("^123.456.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("^123.456.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("^123.0.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("^123.0.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("^1.0.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("~123.456.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("a123.456.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("123.456.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("0.0.0~^")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("^123.456.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("~123.456.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("a123.0.789")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("123.0.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("~0.0.0~^")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("~13.0.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("~1.0.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }
    // if(regexForIfNotPinnedCarrot.test("~1123456789.0.0")){
    //   console.log("passed")
    // }
    // else{
    //   console.log("no pass")
    // }


    for (const [dependency, version] of Object.entries(dependenciesSTUFFF)) {
      const dep = dependency as string;
      const ver = version as string;
      //console.log(`${dep}: ${ver}`);
      

      // console.log(ver);
      totalDependencies = totalDependencies + 1;
      // Do something with each dependency and version
      if(regexGeneralTest.test(ver)){
        numGoodDependencies = numGoodDependencies + 1;
        //console.log(`valid: ${ver} of ${dep}`);
      }
      else if (regexForIfNotPinnedTilde.test(ver) || regexForIfNotPinnedCarrot.test(ver)) {
        
        //console.log(`not valid: ${ver} of ${dep}`);
      } else {
        numGoodDependencies = numGoodDependencies + 1;
        //console.log(`valid: ${ver} of ${dep}`);
      }
    }
    if(totalDependencies != 0){
      totalScore = numGoodDependencies/totalDependencies;
    }else{
      totalScore = 1;
    }

    // console.log('totalDependcies value: ' + totalDependencies);
    // console.log('numGoodDependecies value: ' + numGoodDependencies);
    // console.log('resulting totalScore: ' + totalScore);
            
  }
  catch (error) {
      console.log("the requested package url does not exist")
      console.error(error)
      return 0;
  }

  return totalScore;

 }

//manual file testing
// let url_parse = "https://api.github.com/repos/alex-page/pizza/contents/package.json";
// //console.log("starting");
// const version_pinning_score = get_version_pinning_score(url_parse);
// //console.log("done");