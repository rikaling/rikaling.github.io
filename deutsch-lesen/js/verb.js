class Verb {
    constructor(infinitive) {
        this.infinitive = infinitive
    }
}

// 弱變化動詞，只需要一個infinitive形式就可以確定所有變位
class WeakVerb extends Verb {

    constructor(infinitive) {
        super(infinitive)
        if (infinitive.endsWith('en')) {
            let stem = infinitive.substring(0, infinitive.length - 2);
            this.stem = stem
            this.suffix = 'en'
            if (stem.endsWith('d') || stem.endsWith('t') || stem.endsWith('chn') || stem.endsWith('dn') || stem.endsWith('fn') || stem.endsWith('gn') || stem.endsWith('tm')) {
                this.type = 'ten'
            } else {
                this.type = 'en'
            }
        } else if (infinitive.endsWith('n')) {
            this.stem = infinitive.substring(0, infinitive.length - 1);
            this.suffix = 'n'
            if (this.stem.endsWith('er')) {
                this.type = 'ern'
            } else if (this.stem.endsWith('el')) {
                this.type = 'eln'
            }
        }
    }

    get presentParticle() {
        return this.infinitive + 'd';
    }

    get pastParticle() {
        return 'ge' + this.presentIndicative(3);
    }

    get auxiliary() {
        return this.auxiliary
    }


    presentIndicative(person, number = 'sg') {
        return WeakVerb.conjugatePresentIndicative(this, person, number)
    }

    pastIndicative(person, number = 'sg') {
        return WeakVerb.conjuagatePastIndicative(this, person, number)
    }

    subjunctiveI(person = 3, number = 'sg') {
        return WeakVerb.conjugateSubjunctiveI(this, person, number);
    }

    subjunctiveII(person, number = 'sg') {
        return WeakVerb.conjugateSubjunctiveII(this, person, number);
    }

    imperative(person) {
        switch (person) {
            case 'du':
                if (this.type == 'eln') {
                    return this.presentIndicative(1);
                } else if (this.stem.endsWith('d') || this.stem.endsWith('t') || this.stem.endsWith('ig') || this.stem.endsWith('er')) {
                    return this.stem + 'e';
                }
            case 'ihr':
                return this.presentIndicative(2, 'pl');
            case 'Sie':
                return this.presentIndicative(3, 'pl');
            default:
                break;
        }
    }


    static conjuagatePastIndicative(verb, person, number) {
        let stem = verb.stem;
        if (verb.type == 'ten') {
            stem += 'e';
        }
        if (number == 'sg' && person == 2) {
            return stem + 'test';
        } else if (number == 'pl' && person == 2) {
            return stem + 'tet';
        } else if (number == 'pl') {
            return stem + 'ten';
        } else {
            return stem + 'te';
        }
    }

    static conjugateSubjunctiveI(verb, person, number) {
        let suffix = '';
        if (person == 2 && number == 'sg') {
            suffix = 'st';
        } else if (person == 2 && number == 'pl') {
            suffix = 't';
        } else if (number == 'pl') {
            suffix = 'n';
        }
        return WeakVerb.conjugatePresentIndicative(verb, 1, 'sg') + suffix;
    }

    static conjugateSubjunctiveII(verb, person, number) {
        return WeakVerb.conjuagatePastIndicative(verb, person, number)

    }

    static conjugatePresentIndicative(verb, person, number) {
        if (number == 'pl') {
            switch (person) {
                case 1:
                case 3:
                    return verb.infinitive
                case 2:
                    if (verb.type == 'ten') {
                        return verb.stem + 'et';
                    } else {
                        return verb.stem + 't';
                    }
                default:
                    break;
            }
        } else {
            switch (person) {
                case 1:
                    if (verb.type == 'eln') {
                        return verb.infinitive.replace(/eln\b/, 'le');
                    } else {
                        return verb.stem + 'e';
                    }
                case 2:
                    if (verb.type == 'ten') {
                        return verb.stem + 'est';
                    } else if (/.*[sßxz]\b/.test(verb.stem)) {
                        return verb.stem + 't';
                    } else {
                        return verb.stem + 'st';
                    }
                case 3:
                    if (verb.type == 'ten') {
                        return verb.stem + 'et';
                    } else {
                        return verb.stem + 't';
                    }
                default:
                    break;
            }
        }
    }








}


// 強變化動詞，一般需要知道以下形式：
// infinitive
// past participle
// present indicative 1st sg
// present indicative 3rd sg
// past indicative 3rd sg
// subjunctive II 3rd sg
// 個別不規則動詞單獨處理
class StrongVerb extends Verb {
    constructor(infinitive, pastParticle = '', presentIndicativeIch = '', presentIndicativeEr = '', pastIndicativeEr = '', subjunctiveIIEr = '') {
        super(infinitive);
        this.pastParticle = pastParticle;
        this.presentIndicativeIch = presentIndicativeIch;
        this.presentIndicativeEr = presentIndicativeEr;
        this.pastIndicativeEr = pastIndicativeEr;
        this.subjunctiveIIEr = subjunctiveIIEr;
    }

    /**
     * @param {String} v
     */
    set pastParticle(v) {
        this.pastParticle = v;
    }
}


function isStrong(verb) {
    return StrongVerb.prototype.isPrototypeOf(verb)
}

function _inferInfinitive(finite) {
    possibleInfinitives = {}
    if (finite.startsWith('ge') && finite.endsWith('t')) {
        let stem = substring(finite, 2, -1)
        if (stem.endsWith('ier')) {
            possibleInfinitives[stem + 'en'] = 15
        } else if (stem.endsWith('el') || stem.endsWith('er')) {
            possibleInfinitives[stem + 'n'] = 15;
            possibleInfinitives[stem + 'en'] = 11;
        } else {
            possibleInfinitives[appendEn(stem)] = 15;
        }
    }
    if (finite.endsWith('en')) {
        if (finite.endsWith('ten')) {
            let stem = substring(finite, 0, -3);
            let stemEnd = charAt(stem, -1);
            if (stem.endsWith('ier')) {
                possibleInfinitives[stem + 'en'] = 10;
                possibleInfinitives[stem + 'n'] = 1;
            } else if (stem.endsWith('el') || stem.endsWith('er')) {
                possibleInfinitives[stem + 'n'] = 10;
                possibleInfinitives[stem + 'en'] = 2;
                possibleInfinitives[finite] = 4;
            } else if (isConsonant(stemEnd) && stemEnd != 'n' && stemEnd != 'r') {
                possibleInfinitives[stem + 'en'] = 10;
                possibleInfinitives[finite] = 3;
            } else if (stem.endsWith('de') || stem.endsWith('te') || stem.endsWith('chne') || stem.endsWith('dne') || stem.endsWith('fne') || stem.endsWith('gne') || stem.endsWith('tme')) {
                possibleInfinitives[stem + 'n'] = 10;
                possibleInfinitives[finite] = 1;
            } else {
                possibleInfinitives[appendEn(stem)] = 2;
                possibleInfinitives[finite] = 8;
            }
        } else if (finite.endsWith('ieren')) {
            possibleInfinitives[finite] = 10;
        } else if (finite.endsWith('len')) {
            possibleInfinitives[finite.replace(/len\b/, 'eln')] = 8;
            possibleInfinitives[finite] = 6;
        } else if (finite.endsWith('ren')) {
            possibleInfinitives[substring(finite, 0, -2) + 'n'] = 8;
            possibleInfinitives[finite] = 6;
        } else {
            possibleInfinitives[finite] = 10;
        }
    } else if (finite.endsWith('n')) {
        possibleInfinitives[finite] = 10;
    } else if (finite.endsWith('st')) {
        if (finite.endsWith('etest')) {
            let stem = substring(finite, 0, -4);
            let _possibleInfinitives = _inferInfinitive(appendEn(stem))
            possibleInfinitives = concatMap(possibleInfinitives, _possibleInfinitives);
        } else if (finite.endsWith('test')) {
            let _possibleInfinitives = _inferInfinitive(substring(finite, 0, -2))
            possibleInfinitives = concatMap(possibleInfinitives, _possibleInfinitives);
        } else {
            let stem = substring(finite, 0, -2);
            if (stem.endsWith('ier')) {
                possibleInfinitives[stem + 'en'] = 10;
                possibleInfinitives[stem + 'n'] = 1;
            } else if (stem.endsWith('el') || stem.endsWith('er')) {
                possibleInfinitives[stem + 'n'] = 10;
                possibleInfinitives[stem + 'en'] = 1;
            } else {
                possibleInfinitives[appendEn(stem)] = 10;
            }
        }
    } else if (finite.endsWith('t')) {
        if (finite.endsWith('etet')) {
            let stem = substring(finite, 0, -3);
            let _possibleInfinitives = _inferInfinitive(appendEn(stem))
            possibleInfinitives = concatMap(possibleInfinitives, _possibleInfinitives);
        } else if (finite.endsWith('tet')) {
            let _possibleInfinitives = _inferInfinitive(substring(finite, 0, -1))
            possibleInfinitives = concatMap(possibleInfinitives, _possibleInfinitives);
        } else {
            let stem = substring(finite, 0, -1);
            if (stem.endsWith('ier')) {
                possibleInfinitives[stem + 'en'] = 10;
                possibleInfinitives[stem + 'n'] = 1;
            } else if (stem.endsWith('el') || stem.endsWith('er')) {
                possibleInfinitives[stem + 'n'] = 10;
                possibleInfinitives[stem + 'en'] = 1;
            } else {
                possibleInfinitives[appendEn(stem)] = 10;
            }
        }
    } else if (finite.endsWith('e')) {
        if (finite.endsWith('ete')) {
            let stem = substring(finite, 0, -2);
            let _possibleInfinitives = _inferInfinitive(appendEn(stem))
            possibleInfinitives = concatMap(possibleInfinitives, _possibleInfinitives);
            possibleInfinitives[finite + 'n'] = 1;
        } else if (finite.endsWith('te')) {
            let stem = substring(finite, 0, -2);
            let stemEnd = charAt(stem, -1);
            if (isVowel(stemEnd) || stemEnd == 'n' || stemEnd == 'r') {
                possibleInfinitives[finite + 'n'] = 9;
            } else {
                possibleInfinitives[finite + 'n'] = 6;
            }
            if (stem.endsWith('ier')) {
                possibleInfinitives[stem + 'en'] = 10;
                possibleInfinitives[stem + 'n'] = 1;
            } else if (stem.endsWith('el') || stem.endsWith('er')) {
                possibleInfinitives[stem + 'n'] = 10;
                possibleInfinitives[stem + 'en'] = 1;
            } else {
                possibleInfinitives[appendEn(stem)] = 7;
            }
        } else {
            let stem = substring(finite, 0, -1);
            if (stem.endsWith('ier')) {
                possibleInfinitives[stem + 'en'] = 10;
                possibleInfinitives[stem + 'n'] = 1;
            } else if (stem.endsWith('el') || stem.endsWith('er')) {
                possibleInfinitives[stem + 'n'] = 10;
                possibleInfinitives[stem + 'en'] = 1;
            } else {
                possibleInfinitives[appendEn(stem)] = 10;
            }
        }
    } else if (finite.endsWith('nd')) {
        possibleInfinitives[substring(finite, 0, -1)] = 15;
    }
    // let infinitives = Object.keys(possibleInfinitives);
    // infinitives.sort((a, b) => {
    //     return possibleInfinitives[b] - possibleInfinitives[a]
    // })
    // return infinitives;
    // console.log(possibleInfinitives)
    return possibleInfinitives;
}

function inferInfinitive(finite) {
    let possibleInfinitives = _inferInfinitive(finite)
    let infinitives = Object.keys(possibleInfinitives);
    infinitives.sort((a, b) => {
        return possibleInfinitives[b] - possibleInfinitives[a]
    })
    return infinitives;
}