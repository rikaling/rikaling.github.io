'use strict';
var UPPER_ALPHABET = "[ÀÁÂÃÒÓÔÕÙÚÈÉÊÌÍÝĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸ]"
var LOWER_ALPHABET = "[àáâãòóôõùúèéêìíýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]"
var VI_ALPHABET = "[ÀÁÂÃÒÓÔÕÙÚÈÉÊÌÍÝĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸàáâãòóôõùúèéêìíýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\-\\w]"

var WORD_GLOBAL = new RegExp("(" + VI_ALPHABET + "+)", "g")
var WORD = new RegExp("(" + VI_ALPHABET + "+)")

var caseSensitive = true

var selectedRange = [-1, -1]

var thisMemo = ''
var thisWord = ''

var memoItemIndex = 0