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

function isVowel(c) {
    return c >= 'ㄱ' && c <= 'ㅎ'
}

function isConsonant(c) {
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