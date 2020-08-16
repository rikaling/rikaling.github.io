'use strict';

function lastElement(arr){
    if (arr.length>0){
        return arr[arr.length-1];
    }
    return undefined;
}

function isBlank(s){
    return /^\s+$/.test(s);
}


function parseSpanIndex(id){
    return parseInt(id.substring(5));
}