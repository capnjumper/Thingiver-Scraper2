let fs = require('fs')
const toyJson = require('./toyJson');
const toyFiles = require('./toyFiles');
const prompt = require('prompt');
let title;

const runProgram = function(url){
  const filesurl = (url + '/#files');

  toyJson.imgScrape(url,(data)=>{
      title = data.title
      toyFiles.imgScrape(filesurl, title, (data) =>{});
  });
}

prompt.start();
console.log('provide url or file')
  prompt.get(['response'], function (err, result) {
    let response = result.response

    if(response.includes(".txt")== true){
    fs.readFile(response, function(err, data) {
          if(err) throw err;

          var filterData = function(stuff){
            let cleanArray = []
            let clean;
            let index;
            stuff = stuff.toString().split(',');
              for (var i=0; i< stuff.length ; i++ ){
                var cleanData = stuff[i].replace(/\r?\n|\r/g,',')
                cleanArray.push(cleanData)
              }
            clean = cleanArray.toString().split(',')
            clean.pop()
            return clean
          }

        let urls = filterData(data)
        console.log(urls)
        for(let i =0; i<urls.length; i++){
          runProgram(urls[i])
        }
      })
    }else if(response.includes("thingiverse.com")== true){
      runProgram(response)
    }else{
      console.log("please provide valid link or file")
    }
  })





//
// if(process.argv[2]==null){
//   console.log("GIMME A URL")
// }
// else{
//   runProgram(process.argv[2]);
// }
