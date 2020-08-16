'use strict';
const KOR_BEGIN = 44032
const KOR_END = 55203
const CHO_BASE = 588
const JUNG_BASE = 28

const INITIAL_CONSONANTS = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
    'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
    'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]

const VOWELS = [
    'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
    'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
    'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
    'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
    'ㅣ'
]

const FINAL_CONSONANTS = [
    ' ', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
    'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
    'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
    'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
    'ㅌ', 'ㅍ', 'ㅎ'
]

const CONSONANTS = [
    'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ',
    'ㄶ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㄺ',
    'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
    'ㅀ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅄ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
    'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]

function hasFinalConsonant(c) {
    return decompose(c).finalConsonant.length > 0;
}

function isConsonant(c) {
    return c >= 'ㄱ' && c <= 'ㅎ'
}

function isFinalConsonant(c) {
    return FINAL_CONSONANTS.includes(c);
}

function isInitialConsonant(c) {
    return INITIAL_CONSONANTS.includes(c);
}

function isVowel(c) {
    return c >= 'ㅏ' && c <= 'ㅣ'
}

function onlyHangul(s) {
    return /^[가-힣ㄱ-ㅎㅏ-ㅣ]+$/.test(s)
}

function compose(cho, jung, jong) {
    let choIndex = INITIAL_CONSONANTS.indexOf(cho);
    let jungIndex = VOWELS.indexOf(jung);
    let jongIndex = FINAL_CONSONANTS.indexOf(jong);
    if (choIndex < 0 || jungIndex < 0 || jongIndex < 0) {
        return '';
    }
    return String.fromCharCode(KOR_BEGIN + CHO_BASE * choIndex + JUNG_BASE * jungIndex + jongIndex);
}

function decompose(c) {
    if (isConsonant(c)) {
        return {
            initialConsonant: c,
            vowel: '',
            finalConsonant: ''
        };
    }
    if (isVowel(c)) {
        return {
            initialConsonant: '',
            vowel: c,
            finalConsonant: ''
        };
    }
    let code = c.charCodeAt() - KOR_BEGIN;
    let initId = Math.floor(code / CHO_BASE);
    let vId = Math.floor((code - initId * CHO_BASE) / JUNG_BASE);
    let finId = code - initId * CHO_BASE - vId * JUNG_BASE;
    return {
        initialConsonant: INITIAL_CONSONANTS[initId],
        vowel: VOWELS[vId],
        finalConsonant: FINAL_CONSONANTS[finId]
    };
}

function decomposeString(s) {
    let rs = [];
    for (let i = 0; i < s.length; ++i) {
        let c = s.charAt(i);
        let r = decompose(c);
        rs.push(r.initialConsonant);
        rs.push(r.vowel);
        rs.push(r.finalConsonant);
    }
    return rs.join('');
}

function composeString(s) {
    let rs = []
    if (s.length < 2) {
        return s;
    }
    let final = '';
    let vowel = '';
    let initial = '';
    for (let i = s.length - 1; i >= 0; --i) {
        let c = s.charAt(i);
        if (isFinalConsonant(c) && final.length == 0 && vowel.length == 0) {
            final = c;
        } else if (isVowel(c)) {
            vowel = c;
        } else if (isInitialConsonant(c)) {
            initial = c;
            rs.push(compose(initial, vowel, final));
            final = '';
            vowel = '';
            initial = '';
        }
    }
    rs.reverse();
    return rs.join('');
}