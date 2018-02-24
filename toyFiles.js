const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
//import Helpers from 'client/imports/scraperproj/Helpers'

exports.imgScrape=(filesurl, title ,cb)=>{

  request(filesurl,(error,rep,body)=>{
    if(error){
      cb({
        error: error
      });
    }
    const Namify = function(body){
      let name = body
      name = name.replace(new RegExp("[_-]", 'g'), " ")
      name = name.replace(new RegExp("  ", 'g'), " ")
      return name;
    }
    // file names
    const getfilenames = function(body){
      afilenames=[];
      let $ = cheerio.load (body);
      $('.filename').each(function(){
        let filename = $(this).text();
        filename= Namify(filename)
        afilenames.push(filename);
      });
      return afilenames;
    }
    // file url
    const getfileurl = function(body){
      afileurl=[];
      let $ = cheerio.load (body);
      $('div.thing-file a').each(function(){
        let $tags = $(this).attr('href');
        afileurl.push($tags);
      });
      for( i =0; i<afileurl.length; i++){
        afileurl[i]= ('https://www.thingiverse.com' + afileurl[i])
      }
      return afileurl;
    }
    //file img
    const getfileimg = function(body){
      afileimg=[];
      let $ = cheerio.load (body);
      $('a.track.thing-file-download-link img').each(function(){
        let $tags = $(this).attr('data-cfsrc');
        afileimg.push($tags);
      });
      return afileimg;
    }
    let filenames = getfilenames(body);
    let fileurls = getfileurl(body);
    let fileimg = getfileimg(body);
    let len= filenames.length;
    let objs = [];
    for(let i=0; i<len; i++ ){
      objs[i]= {
        name: filenames[i].toLowerCase(),
        image: fileimg[i].toLowerCase(),
        stl: fileurls[i].toLowerCase(),
      };
    }
    // filtering stl file
    const filterSTL = function(x){
      substring='stl'
      let filteredObjs = [];
      for(i=0; i<len; i++ ){
        let url = x[i].name
        if(url.indexOf(substring)!=-1)
        filteredObjs.push(x[i]);
      }
      return filteredObjs;
    }
    let cleanObjs = filterSTL(objs);
    let modelsObj = {
      models: cleanObjs,
    }
    let folderName = title +'/'
    for(let i=0 ; i<fileurls.length; i++){
      let url = fileurls[i]
      let r = request(url);
      let path = folderName+filenames[i]
      r.on('response',  function (savedFileResponse) {
        console.log(path)
        savedFileResponse.pipe(fs.createWriteStream(path));
        console.log("----------> file saved! <------------")
      });
    }
    for(let i=0 ; i<fileimg.length; i++){
      let url = fileimg[i]
      let r = request(url);
      let path = folderName+filenames[i]
      path = path.replace(".stl", ".jpg")
      path = path.replace(".step" , ".jpg")
      r.on('response',  function (savedFileResponse) {
        console.log(path)
        savedFileResponse.pipe(fs.createWriteStream(path));
        console.log("----------> image saved! <------------")
      });
    }
  });
}
