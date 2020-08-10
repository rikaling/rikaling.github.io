'use strict';

const myConsonant = "\u1000-\u1021"; // "က-အ"

const enChar = "a-zA-Z0-9";

// "ဣဤဥဦဧဩဪဿ၌၍၏၀-၉၊။!-/:-@[-`{-~\s"
// const otherChar = "\u1023\u1024\u1025\u1026\u1027\u1029\u102a\u103f\u104c\u104e\u104d\u104f\u1040-\u1049\u104a\u104b!-/:-@\\[-`\\{-~\\s";
const otherChar = "\u1023\u1024\u1025\u1026\u1027\u1029\u102a\u103f\u104c\u104e\u104d\u104f\u1040-\u1049\u104a\u104b";

const ssSymbol = "\u1039";

const ngaThat = "\u1004\u103a";

const aThat = "\u103a";
const subDot = "\u1037"

// Regular expression pattern for Myanmar syllable breaking
// *** a consonant not after a subscript symbol AND a consonant is not
// followed by a-That character or a subscript symbol
// const BREAK_PATTERN = new RegExp("((?<!" + ssSymbol + ")[" + myConsonant + "](?![" + subDot + "]?[" + aThat + ssSymbol +
// 	"])" + "|[" + enChar + otherChar + "])", "mg");
const BREAK_PATTERN = new RegExp("((?<!" + ssSymbol + ")[" + myConsonant + "](?![" + subDot + "]?[" + aThat + ssSymbol +
	"])" +"|["+otherChar+"]" + "|[^\u1000-\u109F])", "mg");


function segment(text) {
	var outArray = text.replace(BREAK_PATTERN, "𝕊$1").split('𝕊')
	if (outArray.length > 0) {
		outArray.shift();
		//out.splice(0, 1);
	}
	return outArray;
}

function segmentWithSeparator(text, separator) {
	if (separator === undefined) {
		separator = "|";
	}
	return text.replace(BREAK_PATTERN, separator + "$1");
}