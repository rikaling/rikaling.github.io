function addUmlaut(word) {
    return word.replaceAll('a', 'ä').replaceAll('o', 'ö').replaceAll('u', 'ü')
}

function removeUmlaut(word) {
    return word.replaceAll('ä', 'a').replaceAll('ö', 'o').replaceAll('ü', 'u')
}

function appendEn(word) {
    if (word.endsWith('e')) {
        return word + 'n';
    } else {
        return word + 'en';
    }
}

function isConsonant(c) {
    return /[bcdfghjklmnpqrstvwxyzß]/i.test(c)
}

function isVowel(c) {
    return /[AEIOUaeiouöäüÖÄÜ]/.test(c)
}

function substring(s, i, j) {
    // if (i >= 0 && j >= 0) {
    //     return s.substring(i, j);
    // } else if (i < 0) {
    //     i = transMinusIndex(i)
    //     if (j == undefined) {
    //         return s.substring(i)
    //     } else if (j < 0) {
    //         j = transMinusIndex(j)
    //         return s.substring(i, j)
    //     }
    // }
    i = transMinusIndex(s, i)
    j = transMinusIndex(s, j)
    return s.substring(i, j)
}

function charAt(s, i) {
    i = transMinusIndex(s, i);
    return s.charAt(i);
}


function transMinusIndex(s, i) {
    if (i == undefined) {
        return i
    }
    if (i < 0) {
        return s.length + i;
    } else {
        return i;
    }
}

function concatMap(o1, o2) {
    for (const key in o2) {
        if (!key in o1) {
            o1[key] = o2[key];
        }
    }
    return o1;
}