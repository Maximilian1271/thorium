var jsonToMap=function(jsonStr){
    return new Map(JSON.parse(jsonStr));
}
module.exports=jsonToMap;