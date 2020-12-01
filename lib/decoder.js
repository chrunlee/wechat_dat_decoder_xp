//修改图片
var fs = require('fs');
var path = require('path');

//值是多少自己算。
var base = 0xFF;
var next = 0xD8;
var gifA = 0x47;
var gifB = 0x49;
var pngA = 0x89;
var pngB = 0x50;
let bmpA = 0x42;
let bmpB = 0x4d;
var count = 0;
function decoder (scanDir){
    var files = fs.readdirSync(scanDir);
    //找到dat
    var arr = [];
    var count = 0;
    files.forEach(function(item){
        if(path.extname(item).toLowerCase() == '.dat'){
            convert(path.join(scanDir,item));
            count++;
        }
    })
    console.log('全部转换完毕,共计'+count+'文件')
}


//convert
function convert(filePath){
    var extname = '.jpg';
    var content = fs.readFileSync(filePath);
    var firstV = content[0],
        nextV = content[1],
        jT = firstV ^ base,
        jB = nextV ^ next,
        gT = firstV ^ gifA,
        gB = nextV ^ gifB,
        pT = firstV ^ pngA,
        pB = nextV ^ pngB,
        bT = firstV ^ bmpA,
        bB = nextV ^ bmpB;
    var v = firstV ^ base;
    if(jT == jB){
        v = jT;
        extname = '.jpg';
    }else if(gT == gB){
        v = gT;
        extname = '.gif';
    }else if(pT == pB){
        v = pT;
        extname = '.png';
    }else if(bT == bB){
        v = bT;
        extname = '.bmp';
    }
    var imgPath = path.join(path.dirname(filePath),path.basename(filePath)+extname);
    var bb = [];
    for(var i=0;i<content.length;i++){
        var t = content[i];
        bb.push(t ^ v);
    }
    fs.writeFileSync(imgPath,new Buffer(bb));
}

module.exports= decoder;