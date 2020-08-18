class Suffix {
    // 詞尾列表
    static suffixes = [];
    // 規則的第一語基詞尾
    static base1suffixes = ['겠다', '고', '고자', '기', '자', '지', '는다', '소', '겠어', '게'];
    // 暫時沒用
    static base2suffixes = ['나', '니', 'ㄴ', 'ㄹ', 'ㅁ', '시다', '면', '셔'];
    // 規則的第三語基詞尾
    static base3suffixes = ['도', '보다', '서', 'ㅆ다', '요', '지다', 'ㅆ어', '야'];

    constructor(text, rule = null) {
        this._text = text;
        this._rule = rule;
    }

    get text() {
        return this._text;
    }

    get rule() {
        return this._rule;
    }

    static add(suffix) {
        Suffix.suffixes.push(suffix);
    }

    static hasSuffix(word) {
        for (const suffix of Suffix.suffixes) {
            if (decomposeString(word).endsWith(decomposeString(suffix.text))) {
                return suffix;
            }
        }
        return null;
    }

    static initSuffixes() {
        for (const suf of Suffix.base1suffixes) {
            Suffix.add(new Suffix(suf, base1suffixRule(suf)));
        }
        for (const suf of Suffix.base3suffixes) {
            Suffix.add(new Suffix(suf, base3suffixRule(suf)));
        }
        //irregular
        Suffix.add(new Suffix('나', (status) => {
            let lems = [];
            for (const lem of status.text) {
                let text = lem.substring(0, lem.length - 1);
                lems = lems.concat(searchLemmaByBase2(text));
                lems = lems.concat(searchLemmaByBase1(text));
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }));

        //irregular
        Suffix.add(new Suffix('니', (status) => {
            let lems = [];
            for (const lem of status.text) {
                let text = lem.substring(0, lem.length - 1);
                lems = lems.concat(searchLemmaByBase2(text));
                lems = lems.concat(searchLemmaByBase1(text));
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }));

        // 規則的第二語基語尾
        Suffix.add(new Suffix('시다', base2suffixRule('시다')));
        Suffix.add(new Suffix('셔', base2suffixRule('셔')));
        Suffix.add(new Suffix('ㄴ', base2suffixRule('ㄴ')));
        Suffix.add(new Suffix('ㄹ', base2suffixRule('ㄹ')));
        Suffix.add(new Suffix('ㅁ', base2suffixRule('ㅁ')));
        Suffix.add(new Suffix('오', base2suffixRule('오')));
        Suffix.add(new Suffix('세요', base2suffixRule('세요')));
        Suffix.add(new Suffix('ㄴ다', base2suffixRule('ㄴ다')));


        //irregular
        Suffix.add(new Suffix('ㄻ', (status) => {
            let lems = [];
            for (const lem of status.text) {
                let dtext = decomposeString(lem)
                let text = composeString(dtext.substring(0, dtext.length - 1) + 'ㄹ');
                lems = lems.concat(searchLemmaByBase1(text));
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }));

        // irregular
        Suffix.add(new Suffix('면', (status) => {
            let lems = [];
            for (const lem of status.text) {
                let text = lem.substring(0, lem.length - 1);
                if (endsWithHangul(text, 'ㄹ')) {
                    lems = lems.concat(searchLemmaByBase1(text));
                } else {
                    lems = lems.concat(searchLemmaByBase2(text));
                }
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }));

        Suffix.add(new Suffix('오'), (status) => {
            let lems = [];
            for (const word of status.text) {
                let base = word.substring(0, word.length - 1);
                lems = lems.concat(searchLemmaByBase2(base));
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        })

        Suffix.add(new Suffix('는', (status) => {
            let lems = []
            for (const word of status.text) {
                let base = word.substring(0, word.length - 1)
                lems = lems.concat(searchLemmaByBase1(base))
                lems.push(base);
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }));

        // 語基解釋不了的詞尾
        Suffix.add(new Suffix('습니다', smndRule));
        Suffix.add(new Suffix('습니까', smndRule));
        Suffix.add(new Suffix('ㅂ니다', mndRule));
        Suffix.add(new Suffix('ㅂ니까', mndRule));

        // 語尾從長到短排序
        Suffix.suffixes.sort((a, b) => {
            let diff = b.text.length - a.text.length;
            if (diff == 0) {
                return decomposeString(b.text).length - decomposeString(a.text).length;
            }
            return diff;
        })
    }
}

// 初始化語尾列表
Suffix.initSuffixes();

// Rule of 습니다 and 습니까
function smndRule(status) {
    let lems = [];
    for (const word of status.text) {
        let stem = word.substring(0, word.length - 3);
        lems.push(stem + '다')
    }
    if (lems.length > 0) {
        return {
            text: unique(lems),
            finished: false
        };
    }
    return {
        text: status.text,
        finished: true
    };
}

// Rule for -ㅂ니다 / -ㅂ니까
function mndRule(status) {
    let lems = [];
    for (const word of status.text) {
        let stem = removeSuffix(word.substring(0, word.length - 2), 'ㅂ');
        lems = lems.concat(searchLemmaByBase2(stem))
    }
    if (lems.length > 0) {
        return {
            text: unique(lems),
            finished: false
        };
    }
    return {
        text: status.text,
        finished: true
    };
}


// Rule for 規則的第二語基語尾
function base2suffixRule(suffix) {
    if (isFinalConsonant(suffix.charAt(0))) {
        return function (status) {
            let lems = []
            for (const word of status.text) {
                let base = removeSuffix(word, suffix);
                lems = lems.concat(searchLemmaByBase2(base))
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        };
    }
    return function (status) {
        let lems = []
        for (const word of status.text) {
            let base = word.substring(0, word.length - suffix.length)
            lems = lems.concat(searchLemmaByBase2(base))
        }
        if (lems.length > 0) {
            return {
                text: unique(lems),
                finished: false
            };
        }
        return {
            text: status.text,
            finished: true
        };
    };
}

function base3suffixRule(suffix) {
    if (isFinalConsonant(suffix.charAt(0))) {
        return function (status) {
            let lems = []
            for (const word of status.text) {
                let base = removeSuffix(word, suffix);
                lems = lems.concat(searchLemmaByBase3(base))
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }

            return {
                text: status.text,
                finished: true
            };
        };
    }
    return function (status) {
        let lems = []
        for (const word of status.text) {
            let base = word.substring(0, word.length - suffix.length)
            lems = lems.concat(searchLemmaByBase3(base))
        }
        if (lems.length > 0) {
            return {
                text: unique(lems),
                finished: false
            };
        }
        return {
            text: status.text,
            finished: true
        };
    };
}

function base1suffixRule(suf) {
    if (isFinalConsonant(suf.charAt(0))) {
        return function (status) {
            let lems = []
            for (const lemma of status.text) {
                let text = removeSuffix(lemma, suf);
                lems = lems.concat(searchLemmaByBase1(text))
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }
    } else {
        return function (status) {
            let lems = []
            for (const lemma of status.text) {
                let text = lemma.substring(0, lemma.length - suf.length)
                lems = lems.concat(searchLemmaByBase1(text))
            }
            if (lems.length > 0) {
                return {
                    text: unique(lems),
                    finished: false
                };
            }
            return {
                text: status.text,
                finished: true
            };
        }
    }
}

