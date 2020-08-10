'use strict';

const MY_CHAR = "[\u1000-\u103F\u104C-\u108F]"
const ALL_MY_CHAR = new RegExp('^' + MY_CHAR + '+$')

var selectionRange = { left: -1, right: -1 }

var newNotes = {}

var oldNotes = {}