'use strict';

function lastElement(arr) {
    if (arr.length > 0) {
        return arr[arr.length - 1];
    }
    return undefined;
}

function isBlank(s) {
    return /^\s+$/.test(s);
}


function parseSpanIndex(id) {
    return parseInt(id.substring(5));
}

function unique(arr) {
    let uarr = [];
    for (const e of arr) {
        if (!uarr.includes(e)) {
            uarr.push(e);
        }
    }
    return uarr;
}


function sum(arr) {
    return arr.reduce((a, b) => {
        return a + b;
    });
}

function average(arr) {
    return sum(arr) / arr.length;
}

function variance(arr) {
    let avrg = average(arr);
    let sumPower = 0;
    for (const e of arr) {
        sumPower += (e - avrg) * (e - avrg);
    }
    return sumPower / arr.length;
}