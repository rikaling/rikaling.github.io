function lemmatize(word) {
    let result = lemmatizeWord(word)
    if (result.includes(word)) {
        return filterVerb(searchLemmaByBase3(word).concat(result));
    }
    return filterVerb(result);
}


function lemmatizeWord(word) {
    let result = []
    if (word in lemmas) {
        result.push(word);
        return result;
    }
    let suf = Suffix.hasSuffix(word);
    if (suf == null) {
        result.push(word);
        return result;
    }
    let words = [word];
    let status = { text: words, finished: false };
    if (suf != null) {
        status = suf.rule(status);
        if (status.finished) {
            return result.concat(status.text)
        }
        for (const w of status.text) {
            result = result.concat(lemmatizeWord(w))
        }
    }
    return result;
}

function searchLemmaByBase1(base) {
    if (base in base1lemma) {
        return base1lemma[base]
    }
    for (const base1 of base1s) {
        if (base.endsWith(base1)) {
            let i = base.lastIndexOf(base1);
            let pref = base.substring(0, i)
            let sufs = base1lemma[base1];
            let lems = []
            for (const suf of sufs) {
                lems.push(pref + suf)
            }
            return lems;
        }
    }
    if (base.endsWith('겠')) {
        return [base + '다'];
    }
    if (endsWithHangul(base, 'ㅆ')) {
        return [base + '다'];
    }
    return [];

}

function searchLemmaByBase2(base) {
    if (base in base2lemma) {
        return base2lemma[base]
    }
    for (const base2 of base2s) {
        if (base.endsWith(base2)) {
            let i = base.lastIndexOf(base2);
            let pref = base.substring(0, i)
            let sufs = base2lemma[base2];
            let lems = []
            for (const suf of sufs) {
                lems.push(pref + suf)
            }
            return lems;
        }
    }
    if (base.endsWith('겠으')) {
        return [base.substring(0, base.length - 2) + '겠다'];
    }
    if (endsWithHangul(base, 'ㅆ으')) {
        return [base.substring(0, base.length - 1) + '다'];
    }
    return [];
}

function searchLemmaByBase3(base) {
    if (base in base3lemma) {
        return base3lemma[base]
    }
    for (const base3 of base3s) {
        if (base3.length == 0) {
            continue;
        }
        if (base.endsWith(base3)) {
            let i = base.lastIndexOf(base3);
            let pref = base.substring(0, i)
            let sufs = base3lemma[base3];
            let lems = []
            for (const suf of sufs) {
                lems.push(pref + suf)
            }
            return lems;
        }
    }
    return [];
}


function Base2Lemma(base, type = 1) {
    let lemmas = [];
    switch (type) {
        case 1:
            lemmas.push(base + '다');
            let d = decompose(base.charAt(base.length - 1));
            if (d.finalConsonant.length == 0) {
                lemmas.push(base.substring(0, base.length - 1) + compose(d.initialConsonant, d.vowel, 'ㄹ'));
            }
            break;
        case 2:
            break;
        case 3:
            break;

        default:
            break;
    }
    return lemmas;
}

console.log(lemmatize('퍼'))