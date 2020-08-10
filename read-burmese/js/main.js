'use strict';

$(() => {

    $('body').click((e) => {
        if (!$(e.target).hasClass('syllable')) {
            selectionRange.left = -1
            selectionRange.right = -1
            $(".selected").removeClass("selected")
        }
    })

    $('#btn-submit-text').click((e) => {
        let text = $('#input-text').val()
        $('#text-parsed').html(genReadContent(text).html())
    })

    $(document).on("click", ".syllable", (e) => {
        let span = $(e.currentTarget)
        let index = parseInt(span.attr("data-span-index"))
        if (selectionRange.left == index + 1) {
            selectionRange.left = index;
        } else if (selectionRange.right == index - 1) {
            selectionRange.right = index;
        } else {
            selectionRange.left = index;
            selectionRange.right = index;
        }
        select()
        $('#input-word').focus()
    })

    $('#btn-copy-word').click((e) => {
        let element = $('#input-word').get(0)
        let val = element.value
        element.select()
        document.execCommand('copy')
        $('#input-word').get(0).setSelectionRange(val.length, val.length)
    })

    $('#btn-note').click((e) => {
        let note = $('#input-note').val()
        let word = $('#input-word').val()
        if (word in newNotes) {
            if (note.length == 0) {
                if (word in oldNotes) {
                    newNotes[word] = note;
                    showNoteInList(word, 'Note deleted');
                } else {
                    delete newNotes[word];
                    deleteNoteFromList(word)
                }
            } else {
                newNotes[word] = note;
                showNoteInList(word);
            }
        } else if (word in oldNotes) {
            if (note != oldNotes[word]) {
                newNotes[word] = note;
                showNoteInList(word);
            }
        } else if (note.length > 0) {
            newNotes[word] = note;
            showNoteInList(word);
        }
    })

    $('#btn-load-file').click((e) => {
        startRead();
    })

    $('#btn-save-notes').click((e) => {
        if (Object.keys(newNotes).length > 0) {
            saveNotes();
            download(JSON.stringify(oldNotes, null, 2), 'notes.json', 'text/plain');
        }
    })

    $('#input-word').keypress((e) => {
        if (e.code == 'Enter') {
            e.preventDefault()
            $('#input-note').focus()
        }
    })

    $('#input-word').blur((e) => {
        let input = $(e.target)
        input.val(input.val().trim())
        loadNoteInput()
    })

    $('#input-note').keypress((e) => {
        if (e.code == 'Enter') {
            if (e.ctrlKey) {
                e.preventDefault()
                $("#btn-note").click()
            }
        }
    })

    $('#btn-hide').click((e) => {
        $('#btn-new-text').show()
    })

    $('#btn-new-text').click((e) => {
        $(e.target).hide()
    })


})

function deleteNoteFromList(word) {
    let dt = $('#note-list dt[data-word="' + word + '"]')
    if (dt.length > 0) {
        dt.next().remove()
        dt.remove()
    }
}

function showNoteInList(word, note = undefined) {
    if (note == undefined) {
        note = newNotes[word]
    }
    let dt = $('#note-list dt[data-word="' + word + '"]')
    if (dt.length == 0) {
        dt = $('<dt></dt>')
        dt.text(word).attr('data-word', word)
        let dd = $('<dd></dd>')
        dd.text(note)
        $('#note-list').append(dt).append(dd)
    } else {
        let dd = dt.next()
        dd.text(note)
    }
}

function loadNoteInput() {
    $('#input-note').val(retrieveNote($('#input-word').val()));
}


function retrieveNote(word) {
    if (word in newNotes) {
        return newNotes[word];
    } else if (word in oldNotes) {
        return oldNotes[word];
    } else {
        return '';
    }
}

function saveNotes() {
    for (const word in newNotes) {
        oldNotes[word] = newNotes[word]
    }
    newNotes = {}
    $('#note-list').empty()
}


function select() {
    $(".selected").removeClass("selected")
    let syllables = []
    for (let i = selectionRange.left; i <= selectionRange.right; ++i) {
        let span = $("span.syllable[data-span-index='" + String(i) + "']")
        span.addClass("selected")
        syllables.push(span.text())
    }
    let word = syllables.join("")
    $("#input-word").val(word)
    loadNoteInput()
}


function createSpan(text, index, isMySyllable = true) {
    let span = $('<span></span>')
    span.text(text).attr('data-span-index', index)
    if (isMySyllable) {
        span.addClass('syllable')
    }
    return span
}

function splitLines(text) {
    return text.split('\n')
}

function genReadContent(text) {
    let lines = splitLines(text)
    let div = $('<div></div>')
    let spanIndex = 0
    let other = ''
    for (const line of lines) {
        if (line.length == 0) {
            continue;
        }
        let p = $('<p></p>')
        let segmentations = segment(line)
        for (const seg of segmentations) {
            if (isMySyllable(seg)) {
                if (other.length > 0) {
                    createSpan(other, spanIndex++, false).appendTo(p)
                    other = ''
                }
                createSpan(seg, spanIndex++).appendTo(p)
            } else {
                other += seg
            }
        }
        if (other.length > 0) {
            createSpan(other, spanIndex++, false).appendTo(p)
            other = ''
        }
        p.appendTo(div)
    }
    return div
}