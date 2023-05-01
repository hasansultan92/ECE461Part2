import {get_license_score} from '../controllers/MetricCalculator/license_score_calc/license';
import {get_urls, URL_PARSE} from '../controllers/MetricCalculator/url_parser';
import {create_logger} from '../controllers/MetricCalculator/logging_setup';
import {get_bus_factor_score} from '../controllers/MetricCalculator/bus_factor/bus_factor';
import {get_responsiveness_score} from '../controllers/MetricCalculator/responsiveness_factor/responsiveness';
import {create_tmp, delete_dir} from '../controllers/MetricCalculator/license_score_calc/license_fs';
import {clone_and_install} from '../controllers/MetricCalculator/license_score_calc/license_util';


const utilSync = require("node:util");
const fs = require('fs');
const arrayToNdjson = require('array-to-ndjson');
const { execSync } = require('node:child_process');
export interface SCORE_OUT {
  Status: number;
  URL: string;
  NetScore: number;
  RampUp: number;
  Correctness: number;
  BusFactor: number;
  ResponsiveMaintainer: number;
  License: number;
  VersionPinning: number;
  CodeReview: number;
}

//get_license_score('git@github.com:davglass/license-checker.git').then(
//  (data: number) => {
//    console.log(data);
//  }
//);

function net_score_formula(subscores: SCORE_OUT): number {
  // prettier-ignore
  const net_score: number =
  subscores.License * (
    (subscores.RampUp * 0.2) +
    (subscores.Correctness * 0.2) +
    (subscores.BusFactor * 0.4) +
    (subscores.ResponsiveMaintainer * 0.2)
  );
  return net_score;
}

export async function metricCalculatorProgram(repo_url: string): Promise<SCORE_OUT> {
  create_logger();

  const urls = await get_urls(repo_url);
  console.log(urls[0].github_repo_url);
  if(!urls[0].github_repo_url){
    console.log("oh would you look at that it is empty");
    const score: SCORE_OUT = {
      Status: -2,
      URL: "",
      NetScore: 0,
      RampUp: 0,
      Correctness: 0,
      BusFactor: 0,
      ResponsiveMaintainer: 0,
      License: 0,
      VersionPinning: 0,
      CodeReview: 0
    };


    // All scores out at same time
    //arrayToNdjson(await Promise.all(score_list)).pipe(process.stdout);
    return score;

  }
  else{
    console.log("not empty!");
    // Each url score computed one by one -> slow!
    const score_list: Promise<SCORE_OUT>[] = urls.map(
      async (url_parse: URL_PARSE) => {
        const score: SCORE_OUT = {
          Status: -1,
          URL: url_parse.original_url, // SHOULD THIS BE ORIGINAL?
          NetScore: 0,
          RampUp: 0,
          Correctness: 0,
          BusFactor: 0,
          ResponsiveMaintainer: 0,
          License: 0,
          VersionPinning: 1,
          CodeReview: 1
        };

        const tmp_dir: string = await create_tmp(); 
        const success = await clone_and_install(tmp_dir, url_parse.github_repo_url);

        const pyStart = 'python3 /home/robinchild01/persistentServer2/ECE461Part2/fileCounter.py ';
        const pyExec = pyStart.concat(tmp_dir).concat('/package');
        execSync(pyExec);
        //console.log(pyExec);

        var array = fs.readFileSync('info.tmp').toString().split('\n');
        const ramp_up_sub_score = parseFloat(array[0]);
        const correctness_sub_score = parseFloat(array[1]);
        const license_sub_score = get_license_score(url_parse.github_repo_url, tmp_dir);
        const bus_factor_sub_score = get_bus_factor_score(
          url_parse.github_repo_url
        );	
        const responsiveness_sub_score = get_responsiveness_score(
          url_parse.github_repo_url
        );

        score.License = await license_sub_score;
        score.BusFactor = Number((await bus_factor_sub_score).toFixed(3));
        score.ResponsiveMaintainer = Number(
          (await responsiveness_sub_score).toFixed(2)
        );
        score.RampUp = await ramp_up_sub_score;
        score.Correctness = await correctness_sub_score;
        score.NetScore = net_score_formula(score);
        if(score.RampUp > 0.5 && score.Correctness > 0.1 && score.BusFactor > 0.1 && score.ResponsiveMaintainer > 0.1 && score.License > 0.1 && score.VersionPinning > 0.1 && score.CodeReview > 0.1){
          score.Status = 1;
        }
        else{
          score.Status = 0;
        }      
        
        //delete_dir(tmp_dir);
        return score;
      }
    );
    // All scores out at same time
    arrayToNdjson(await Promise.all(score_list)).pipe(process.stdout);
    return score_list[0];

  }
  
}


async function main() {
  create_logger();
  const args = process.argv.slice(2);
  globalThis.logger.debug(`main args: ${args}`);

  const score = await metricCalculatorProgram(args[0]);
  console.log(score)
  
}

//main();
