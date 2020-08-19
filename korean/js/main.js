'use strict';

$(() => {
    // $('#btn-input-word').click(() => {
    //     $('#list-lemmas').empty();
    //     let word = $('#input-word').val();
    //     let lemmas = lemmatize(word);
    //     for (const lemma of lemmas) {
    //         $('<li></li>').text(lemma).appendTo('#list-lemmas');
    //     }
    // });

    // $('#btn-input-char').click(() => {
    //     $('#composed').empty();
    //     let char = $('#input-char').val();
    //     let r = decompose(char)
    //     $('#composed').text(r.initialConsonant + ' ' + r.vowel + ' ' + r.finalConsonant)
    // });

    $('#btn-parse').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        $('#text-parsed').empty();
        text = new Text($('#input-text').val());
        text.generateHtml($('#text-parsed'));
    })

    $(document).on("click", ".hangul", (e) => {
        e.stopPropagation();
        $(e.target).data('node').click(e.ctrlKey);
        updateInputWord();
        loadNoteInput();
        $('#input-word').focus()
    })

    // $(document).on("click", 'nav#possible-lemmas a.nav-link', (e) => {

    // });

    $('body').click((e) => {
        if (!$(e.target).hasClass('hangul')) {
            if (text != null) {
                text.clearSelection();
            }
        }
    });

    $('#btn-load-file').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        startRead();
    })

    $('#btn-save-notes').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        if (Object.keys(newNotes).length > 0) {
            saveNotes();
            download(JSON.stringify(oldNotes, null, 2), 'notes.json', 'text/plain');
        }
    })

    $('#btn-copy-word').click((e) => {
        e.stopPropagation();
        let element = $('#input-word').get(0);
        let val = element.value;
        element.select();
        document.execCommand('copy');
        $('#input-word').get(0).setSelectionRange(val.length, val.length);
    });

    $('#input-word').keypress((e) => {
        if (e.code == 'Enter') {
            e.preventDefault();
            updateInputWord($('#input-word').val());
            $('#input-note').focus();
        }
    });

    $('#input-word').blur((e) => {
        $('#input-word').val($(e.target).val().trim());
        loadNoteInput();
    })

    $('#input-file').click((e) => {
        e.stopPropagation();
    })

    $('#input-word').click((e) => {
        e.stopPropagation();
    })

    $('#input-note').click((e) => {
        e.stopPropagation();
    })

    $('#input-text').click((e) => {
        e.stopPropagation();
    })

    $('#input-note').keypress((e) => {
        if (e.code == 'Enter') {
            if (e.ctrlKey) {
                e.preventDefault()
                $("#btn-note").click();
            }
        }
    });

    $('#btn-hide').click((e) => {
        $('#btn-new-text').show()
    });

    $('#btn-new-text').click((e) => {
        $(e.target).hide()
    });

    $('#btn-note').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        let note = $('#input-note').val();
        let word = $('#input-word').val();
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


    // Handle events of dictionary links
    $('#link-naver-ko-zh').click((e) => {
        e.stopPropagation();
        let url = 'https://dict.naver.com/kozhdict/#/search?query=' + $('#input-word').val();
        $(e.target).attr('href', url);
    })

    $('#link-wiktionary').click((e) => {
        e.stopPropagation();
        let url = 'https://en.wiktionary.org/wiki/' + $('#input-word').val();
        $(e.target).attr('href', url);
    })

    $('#link-glosbe').click((e) => {
        e.stopPropagation();
        let url = 'https://ja.glosbe.com/ko/zh/' + $('#input-word').val();
        $(e.target).attr('href', url);
    })

    $('#link-google-translate').click((e) => {
        e.stopPropagation();
        let url = 'https://translate.google.com/?hl=ko#view=home&op=translate&sl=ko&tl=zh-CN&text=' + $('#input-word').val();
        $(e.target).attr('href', url);
    })

    $('#link-hujiang').click((e) => {
        e.stopPropagation();
        let url = 'https://dict.hjenglish.com/kr/' + $('#input-word').val();
        $(e.target).attr('href', url);
    })

    $('#link-daum').click((e) => {
        e.stopPropagation();
        let url = 'https://dic.daum.net/search.do?q=' + $('#input-word').val() + '&dic=ch';
        $(e.target).attr('href', url);
    })


    // Handle events of note list
    $(document).on('click', '#note-list-nav a', (e) => {
        e.stopPropagation();
        let word = $(e.target).text()
        $('#input-word').val(word)
        loadNoteInput();
    })

    $(document).on('click', '#note-list dt', (e) => {
        e.stopPropagation();
        let word = $(e.target).text();
        $('#input-word').val(word);
        loadNoteInput();
    })

    $(document).on('click', '#note-list dd', (e) => {
        e.stopPropagation();
        let word = $(e.target).text();
        $('#input-word').val(word);
        loadNoteInput();
    })

    $("#btn-copy-notes").click((e) => {
        e.stopPropagation();
        copyNotes();
    })

    $('#btn-clear-input-text').click((e) => {
        e.stopPropagation();
        $('#input-text').val('')
    })

    $('#btn-clear-input-note').click((e) => {
        e.stopPropagation();
        $('#input-note').val('')
    })

    $('#btn-compose').one('click', decomposeHandler);
})

function decomposeHandler(e) {
    e.stopPropagation();
    let input = $('#input-word');
    let word = input.val();
    input.val(decomposeString(word));
    $(e.target).one('click', composeHandler);
    $(e.target).text('Compose');
}

function composeHandler(e) {
    e.stopPropagation();
    let input = $('#input-word');
    let word = input.val();
    input.val(composeString(word));
    $(e.target).one('click', decomposeHandler);
    $(e.target).text('Decompose');
}

function lemmaLinkHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    let a = $(e.target);
    $('#input-word').val(a.text());
    loadNoteInput();
    $('#input-word').focus();
    a.addClass('disabled');
    a.siblings().removeClass('disabled');
}



function showPossibleLemmas() {
    $('#possible-lemmas').empty();
    let word = $('#input-word').val();
    let lemmas = lemmatize(word);
    if (lemmas.length > 0) {
        for (const lemma of lemmas) {
            let a = $('<a></a>').attr('href', '#').addClass('nav-link').text(lemma.lemma);
            if (lemma.exactMatch){
                a.addClass('font-weight-bold');
            }
            a.click(lemmaLinkHandler);
            a.appendTo('#possible-lemmas');
            $("#possible-lemmas").removeClass('d-none').show();
        }
    } else {
        $('#possible-lemmas').hide();
    }

}


function updateInputWord(word = undefined) {
    if (word == undefined) {
        word = text.selectedText;
    }
    $('#input-word').val(word);
    showPossibleLemmas();
    loadNoteInput();
}




function showNoteInList(word, note = undefined) {
    if (note == undefined) {
        note = newNotes[word]
    }
    let dt = $('#note-list dt[data-word="' + word + '"]')
    if (dt.length == 0) {
        let id = 'note-' + String(noteIndex++);
        dt = $('<dt></dt>');
        dt.text(word).attr('data-word', word);
        let dd = $('<dd></dd>');
        dt.attr('id', id);
        dd.text(note);
        $('#note-list').append(dt).append(dd)
        let a = $('<a></a>')
        a.text(word)
            .addClass('list-group-item').addClass('list-group-item-action').addClass('text-wrap')
            .attr('href', '#' + id)
            .appendTo("#note-list-nav");
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
    } else if (word in HANJA) {
        let hanjas = HANJA[word];
        let s = '';
        for (const hanja of hanjas) {
            s += '【' + hanja + '】；'
        }
        return s.substr(0, s.length - 1);
    } else {
        return '';
    }
}

function saveNotes() {
    for (const word in newNotes) {
        oldNotes[word] = newNotes[word]
    }
    newNotes = {};
    $('#note-list').empty();
    $('#note-list-nav').empty();
    noteIndex = 0;
}

function deleteNoteFromList(word) {
    let dt = $('#note-list dt[data-word="' + word + '"]')
    if (dt.length > 0) {
        let id = dt.attr('id');
        $('#note-list-nav a[href="#' + id + '"]').remove()
        dt.next().remove()
        dt.remove()
    }
}




function copyNotes() {
    let ta = $("<textarea></textarea>");
    let val = ''
    for (const key in newNotes) {
        if (newNotes[key].length > 0) {
            val += ['**', key, '** ', newNotes[key], '\n'].join('')
        }
    }
    ta.val(val.trim())
    $('body').append(ta)
    ta.get(0).select()
    document.execCommand('copy')
    ta.remove()
}

function devideHanja(s) {
    let devides = _devideHanja(s, 0, s.length);
    if (devides == undefined || devides.length == 0) {
        return undefined;
    }
    devides = unique(devides);
    let bestScore = -999999999;
    let bestDevide = '';
    for (const devide of devides) {
        let thisScore = score(devide);
        if (thisScore > bestScore) {
            bestScore = thisScore;
            bestDevide = devide;
        }
    }
    return bestDevide;
}

function score(devide) {
    let parts = devide.split(' ');
    let score = 9999999 / parts.length;
    let lengths = []
    for (const part of parts) {
        lengths.push(part.length)
    }
    if (lengths[0] == 1 || lengths[parts.length - 1] == 1) {
        score += 50;
    }
    score -= variance(lengths);
    return score;
}


function _devideHanja(s, l, r) {
    let devides = [];
    // console.log(s.substring(l, r))
    if (s.substring(l, r) in HANJA || l == r) {
        devides.push(s.substring(l, r))
    } else {
        for (let i = r - 1; i > l; --i) {
            let devideLeft = _devideHanja(s, l, i);
            let devideRight = _devideHanja(s, i, r);
            if (devideLeft != undefined && devideRight != undefined) {
                for (const dl of devideLeft) {
                    for (const dr of devideRight) {
                        devides.push(dl + ' ' + dr);
                    }
                }
            }
        }
    }
    if (devides.length > 0) {
        return devides
    }
    return undefined;
}