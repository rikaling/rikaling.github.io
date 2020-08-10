'use strict';

function changeCase(c) {
    let word = $("#this-word").val()
    if (c == 'capitalize') {
        word = capitalize(word)
    } else if (c == 'lower') {
        word = lower(word)
    }
    $("#this-word").val(word)
    loadMemo()
}


function selectWords(caseSensitive = true) {
    $(".selected").removeClass("selected")
    let words = []
    for (let i = selectedRange[0]; i <= selectedRange[1]; ++i) {
        let span = $("span.word[data-index='" + String(i) + "']")
        span.addClass("selected")
        if (caseSensitive) {
            words.push(span.text())
        } else {
            words.push(lower(span.text()))
        }
    }
    $("#this-word").val(words.join(" "))
    loadMemo()
}

function updateMemo() {
    let word = $("#this-word").val()
    let memo = $("#word-memo").val()
    if (word.length > 0 && (word != thisWord || memo != thisMemo)) {
        if (memo.length == 0) {
            if (word in memoDict) {
                memos[word] = memo;
            } else if (word in memos) {
                delete memos[word]
            }
        } else {
            memos[word] = memo;
        }
        thisMemo = memo
        thisWord = word
        updateMemoDisplay(word, memo)
    }
}

function updateMemoDisplay(word, memo) {
    let dt = $('#unsaved-memo-list dt[data-word="' + word + '"]')
    if (dt.length > 0) {
        let dd = dt.next()
        if (memo.length == 0) {
            if (word in memos) {
                dd.text("Memo Deleted.")
            } else {
                let id = dt.attr('id')
                $('#unsaved-memo-word-list a[href="#' + id + '"]').remove()
                dt.remove()
                dd.remove()
            }
        } else {
            dd.text(memo)
        }
    } else {
        appendNewMemo(word, memo)
    }
}

function appendNewMemo(w, m) {
    let id = 'memo-item-' + String(memoItemIndex++)
    let dt = $("<dt></dt>")
    dt.text(w)
      .attr('data-word', w)
      .attr('id', id)
    let dd = $("<dd></dd>")
    dd.text(m.length == 0 ? "Memo Deleted." : m)
    $("#unsaved-memo-list").append(dt).append(dd)
    let a = $('<a></a>')
    a.text(w)
     .addClass('list-group-item').addClass('list-group-item-action').addClass('text-wrap')
     .attr('href', '#' + id)
     .appendTo($("#unsaved-memo-word-list"))
}

function loadMemo() {
    let word = $("#this-word").val()
    let memo = ''
    if (word in memos) {
        memo = memos[word]
    } else if (word in memoDict) {
        memo = memoDict[word]
    }
    thisMemo = memo
    thisWord = word
    $('#word-memo').val(memo)
}

function newSpan(text, index) {
    let span = $("<span></span>")
    if (!isNumber(text) && isWord(text)) {
        text = standardize(text)
        span.addClass("word")
    }
    span.attr("data-index", index)
    span.text(text)
    return span
}

function splitWords(text) {
    let lines = splitLines(text)
    let words = []
    for (const line of lines){
        words = words.concat(line.split(WORD_GLOBAL))
    }
    return words
}

function splitLines(text) {
    return text.split(/(\n)/)
}

function genReadContent(text) {
    let words = splitWords(text)
    let content = $("<div></div>")
    let curP = $("<p></p>").appendTo(content)
    let i = 0;
    for (const word of words) {
        if (/.*[\r\n].*/.test(word)) {
            newSpan(word, i).appendTo(curP)
            ++i;
            curP = $("<p></p>").appendTo(content)
        } else if (/^\s+$/.test(word)) {
            curP.append(word)
        } else {
            newSpan(word, i).appendTo(curP)
            ++i;
        }
    }
    return content
}

function copyMemos() {
    let ta = $("<textarea></textarea>");
    let val = ''
    for (const key in memos) {
        if (memos[key].length > 0) {
            val += ['**', key, '** ', memos[key], '\n'].join('')
        }
    }
    ta.val(val.trim())
    $('body').append(ta)
    ta.get(0).select()
    document.execCommand('copy')
    ta.remove()
}


// function keyArrowRight(){
//     if (selectedRange[0] == selectedRange[1]){
//         ++selectedRange[0];
//         ++selectedRange[1];
//         selectWords()
//     } else {
//         selectedRange[0] = selectedRange[1] + 1
//         selectedRange[1] = selectedRange[0]
//         selectWords()
//     }
// }

$(() => {



    $("#submit-input-text").click(() => {
        let inputText = $("#input-text").val()
        $("#text-to-read").empty()
        $("#text-to-read").append(genReadContent(inputText))
        return false
    })

    $(document).on("click", ".word", (e) => {
        let span = $(e.currentTarget)
        let index = parseInt(span.attr("data-index"))
        if (selectedRange[0] == index + 1) {
            selectedRange[0] = index;
        } else if (selectedRange[1] == index - 1) {
            selectedRange[1] = index;
        } else {
            selectedRange[0] = index;
            selectedRange[1] = index;
        }
        selectWords(caseSensitive)
        $('#word-memo').focus()
    })

    $(document).on('click', '#unsaved-memo-word-list a', (e) => {
        let word = $(e.target).text()
        $('#this-word').val(word)
        loadMemo()
    })

    $(document).on('click', '#unsaved-memo-list dt', (e) => {
        let word = $(e.target).text()
        $('#this-word').val(word)
        loadMemo()
    })

    $(document).on('click', '#unsaved-memo-list dd', (e) => {
        let word = $(e.target).prev().text()
        $('#this-word').val(word)
        loadMemo()
    })

    $("#submit-memo").click(() => {
        updateMemo()
        return false
    })


    $("#submit-file").click(() => {
        startRead()
        return false
    })

    $("#parse-file").click(() => {
        loadMemoDict()
        return false
    })

    $("#save-memos").click(() => {
        saveChanges()
        return false
    })

    $('body').click((e) => {
        if (!$(e.target).hasClass('word')) {
            selectedRange[0] = -1
            selectedRange[1] = -1
            $(".selected").removeClass("selected")
        }
    })

    $('#case-sensitive-switch').click((e) => {
        e.stopPropagation();
        if ($(e.target).prop('checked') == true) {
            caseSensitive = true
        } else {
            caseSensitive = false
        }
        selectWords(caseSensitive)
    })

    $('#case-sensitive-switch-label').click((e) => {
        e.stopPropagation()
    })

    $('#input-text').click((e) => {
        e.stopPropagation()
    })

    $('#btn-capitalize').click((e) => {
        e.stopPropagation()
        changeCase('capitalize')
    })

    $('#btn-lower').click((e) => {
        e.stopPropagation()
        changeCase('lower')
    })

    $('#btn-hide').click(() => {
        $('#btn-load-new-text').show()
    })

    $('#btn-load-new-text').click((e) => {
        $(e.target).hide()
    })

    $('#word-memo').click((e) => {
        e.stopPropagation()
    })

    $('#word-memo').keypress((e) => {
        if (e.code == 'Enter') {
            if (e.ctrlKey) {
                e.preventDefault()
                $("#submit-memo").click()
            }
        }
    })

    $('#this-word').click((e) => {
        e.stopPropagation()
    })

    $('#this-word').keypress((e) => {
        if (e.code == 'Enter') {
            e.preventDefault()
            $('#word-memo').focus()
        }
    })

    $('#this-word').blur((e) => {
        let input = $(e.target)
        input.val(standardize(input.val().trim()))
        loadMemo()
    })

    $("#btn-copy-memos").click((e) => {
        e.stopPropagation();
        copyMemos()
    })

    $("#link-vndic").click((e) => {
        e.stopPropagation()
        let word = $('#this-word').val()
        let url = "http://4.vndic.net/index.php?word=" + word + "&dict=vi_cn"
        $(e.target).attr('href', url)
    })

    $("#link-wiktionary").click((e) => {
        e.stopPropagation()
        let word = $('#this-word').val()
        let url = "https://en.wiktionary.org/wiki/" + word + "#Vietnamese"
        $(e.target).attr('href', url)
    })

    $("#link-glosbe").click((e) => {
        e.stopPropagation()
        let word = $('#this-word').val()
        let url = "https://ja.glosbe.com/vi/zh/" + word
        $(e.target).attr('href', url)
    })

    $("#link-tratu").click((e) => {
        e.stopPropagation()
        let word = $('#this-word').val()
        let url = "http://tratu.soha.vn/dict/vn_vn/" + word
        $(e.target).attr('href', url)
    })

    $("#link-google-translate").click((e) => {
        e.stopPropagation()
        let word = $('#this-word').val()
        let url = "https://translate.google.com/?hl=vi#view=home&op=translate&sl=vi&tl=zh-CN&text=" + word
        $(e.target).attr('href', url)
    })

    // $(document).keyup((e) => {
    //     console.log(e.code)
    //     if (e.ctrlKey){
    //         switch (e.code) {
    //             case 'ArrowRight':
    //                 keyArrowRight();
    //                 break;

    //             default:
    //                 break;
    //         }
    //     }
    // })

    $(".btn").click((e) => {
        $(e.target).blur()
    })
    
    $('#btn-clear-input-text').click((e) => {
        $('#input-text').val('')
    })

    $('#btn-clear-memo').click((e) => {
        $('#word-memo').val('')
    })
});