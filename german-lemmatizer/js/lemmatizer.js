'use strict';

function lemmatize(word) {
    let stems = new Set();
    let queue = new StatusQueue();
    let initialStatus = new InitialStatus(word);
    queue.extends(initialStatus.move());
    while (!queue.empty) {
        let status = queue.shift();
        console.log(status)
        if (status.isStem) {
            stems.add(status.word);
        } else {
            queue.extends(status.move());
        }
    }
    let lemmas = new Set();
    stems.forEach((stem) => {
        if (stem in knownStems) {
            for (let lemma of stem2lemma[stem]) {
                lemmas.add(lemma);
            }
        } else {
            for (const knownStem of knownStems) {
                if (stem.endsWith(knownStem)) {
                    let prefixEnd = stem.lastIndexOf(knownStem);
                    let prefix = stem.substring(0, prefixEnd);
                    for (let lemma of stem2lemma[knownStem]) {
                        lemmas.add(prefix + lemma);
                    }
                    break;
                }
            }
            for (const lemma of stem2lemmaWeak(stem)) {
                lemmas.add(lemma);
            }
        }
    })
    let possibleLemmas = Array.from(lemmas);
    let realLemmas = [];
    for (const lemma of possibleLemmas) {
        if (knownVerbs.includes(lemma)) {
            realLemmas.push(lemma)
        }
    }
    if (realLemmas.length > 0) {
        return realLemmas;
    }
    return possibleLemmas;
}

function isConsonant(c) {
    return /[a-zA-ZßÖÄÜöäü]/.test(c) && !/[aiueoAIUEOöäüÖÄÜ]/.test(c)
}

function stem2lemmaWeak(stem) {
    let lemmas = new Set();
    if (stem.endsWith('el') || stem.endsWith('er')) {
        lemmas.add(stem + 'n');
    } else if ((stem.endsWith('l') || stem.endsWith('r')) && isConsonant(stem.charAt(stem.length - 2))) {
        lemmas.add(stem.substring(0, stem.length - 1) + 'e' + stem.charAt(stem.length - 1) + 'n');
    }
    lemmas.add(stem + 'en');
    lemmas = Array.from(lemmas);
    let realLemmas = []
    for (const lemma of lemmas) {
        for (const weakVerb of WEAK_VERBS) {
            if (lemma.endsWith(weakVerb)) {
                realLemmas.push(lemma);
                break;
            }
        }
    }
    return realLemmas;
}


function appendEn(word) {
    if (word.endsWith('e')) {
        return word + 'n';
    }
    return word + 'en';
}
