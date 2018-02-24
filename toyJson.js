const request = require('request');
const schema = require('js-schema');
const cheerio = require('cheerio');
const fs = require('fs');
var info = {}
exports.imgScrape=(url,cb)=>{
request(url,(error,rep,body)=>{
            const Namify = function(body){
                let name = body.split(".")[0]
                name = name.replace(new RegExp("[_-]", 'g'), " ")
                name = name.replace(new RegExp("  ", 'g'), " ")
                return name;
            }
          //tags
          const getTags = function(body){
            tagarray=[];
            var $ = cheerio.load (body);
            $('.taglist a').each(function(){
                       var $tags = $(this).attr('href');
                       tagarray.push($tags);
          });
            return tagarray;
          }
          //pics
          const getPicUrls = function(body){
            urlarray=[];
            substring= 'jpg'
            var $ = cheerio.load (body);
            $('div.thing-gallery-thumbs img').each(function(){
              var $urls = $(this).attr('data-cfsrc');
                urlarray.push($urls);
              });
                urlarray = urlarray.filter(function( element ) {
                  return element !== undefined;
              });
              return urlarray;
            }
          let $ = cheerio.load(body);
          let picurl=getPicUrls(body);
          var title = $('div.thing-header-data h1').text();
          let l = (title.length/2)
          title = title.slice(0,l)
          let $fileurl= $('thing-download-btn.thing-option-btn.track.launch-modal');
          let $license = $('div.license-text').text();
          let summary = $('.thing-info p').text();
          let $files =$('a.thing-download-btn.thing-option-btn.track.launch-modal').attr('href');
          let author =$('.thing-header-data h2 a').attr('href');
          author = author.replace("/", "")
          let tags = getTags(body);
          let allowedLicenseValues=['Creative Commons - ShareAlike','Creative Commons - NoDerivatives', 'Creative Commons - Attribution',
                           'Creative Commons - PublicDomain', "GNU - LGPL", "BSD", "Toybox", "Public",
                           'CNCShareAlike', 'Creative Commons - Non - Commercial - NoDerivatives', 'CCNC', 'Creative Commons - Attribution - Share Alike',
                           'Creative Commons - Attribution - Non-Commercial - No Derivatives', 'Creative Commons - Attribution - Non-Commercial - Share Alike']
          console.log($license)
          for(var i = 0; i<allowedLicenseValues.length; i++ ){
            if($license.indexOf(allowedLicenseValues[i]) !== -1){
              license=allowedLicenseValues[i]
            }
          }

          ['CCShareAlike','CCNoDerivatives', 'CCAttribution',
-                     'CCPublicDomain', "GNU-GPL", "BSD", "Toybox", "Public",
-                     'CCNCShareAlike', 'CCNCNoDerivatives', 'CCNC']






          console.log("LICENSE IS:" , license)
          var tagLen = tags.length
          var tagsObjs = [];
          for(var i=0; i<tagLen; i++ ){
              let cleanTag = Namify(tags[i]);
              cleanTag = cleanTag.replace("/tag:","")
                tagsObjs[i]= {
                    tag : cleanTag
                      }
                }
      //files
        info = {
            name: title,
            license: license,
            website: url,
            creator: author,
            description: summary,
            tags: tagsObjs,
            models: [{"stl": x}],
            stl : "teststsstt"
        }
        //make folder
                  var dir = './' + title
                  if (!fs.existsSync(dir)){
                      fs.mkdirSync(dir);
                      }
        info.folder_structure = "junior_protocol"
        var json = JSON.stringify(info)
        let filename = title + '/' + title + '.json'
        fs.writeFile(filename  , json);
// export title variable
        cb({title: title})
      });
}
