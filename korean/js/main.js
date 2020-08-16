'use strict';

$(() => {
    $('#btn-input-word').click(() => {
        $('#list-lemmas').empty();
        let word = $('#input-word').val();
        let lemmas = lemmatize(word);
        for (const lemma of lemmas) {
            $('<li></li>').text(lemma).appendTo('#list-lemmas');
        }
    });


    $('#btn-input-char').click(() => {
        $('#composed').empty();
        let char = $('#input-char').val();
        let r = decompose(char)
        $('#composed').text(r.initialConsonant + ' ' + r.vowel + ' ' + r.finalConsonant)
    });

    $('#btn-parse').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        let text = $('#input-text').val();
        let html = generateHtml(text);
        $('#text-parsed').html(html);
        highlightParticles();
    })

    $(document).on("click", ".hangul", (e) => {
        e.stopPropagation();
        let span = $(e.currentTarget);
        let index = parseSpanIndex(span.attr('id'));
        let groupIndex = spanIndexToGroupIndex[index];
        if (selectionRange.left == index + 1) {
            if (groupIndex == spanIndexToGroupIndex[selectionRange.left] || e.ctrlKey) {
                selectionRange.left = index;
            } else {
                selectionRange.left = index;
                selectionRange.right = index;
            }
        } else if (selectionRange.right == index - 1) {
            if (groupIndex == spanIndexToGroupIndex[selectionRange.right] || e.ctrlKey) {
                selectionRange.right = index;
            } else {
                selectionRange.left = index;
                selectionRange.right = index;
            }
        } else {
            if (e.ctrlKey || span.hasClass('hanja-group')) {
                selectWholeGroup(index);
            } else {
                selectionRange.left = index;
                selectionRange.right = index;
            }
        }
        select()
        $('#input-word').focus()
    })

    $(document).on("click", 'nav#possible-lemmas a.nav-link', (e) => {
        e.stopPropagation();
        e.preventDefault();
        let a = $(e.target);
        $('#input-word').val(a.text());
        loadNoteInput();
        $('#input-word').focus();
        a.addClass('disabled');
        a.siblings().removeClass('disabled');
    });

    $('body').click((e) => {
        if (!$(e.target).hasClass('hangul')) {
            selectionRange.left = -1
            selectionRange.right = -1
            $(".selected").removeClass("selected")
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
            $('#input-note').focus();
        }
    });

    $('#input-word').blur((e) => {
        let input = $(e.target)
        input.val(input.val().trim())
        loadNoteInput()
    })

    $('#input-word').click((e) => {
        e.stopPropagation();
    })

    $('#input-note').click((e) => {
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
        let url = 'https://dic.daum.net/index.do?dic=ch&q=' + $('#input-word').val();
        $(e.target).attr('href', url);
    })

    $(document).on('click', '#note-list-nav a', (e) => {
        e.stopPropagation();
        let word = $(e.target).text()
        $('#input-word').val(word)
        loadNoteInput();
    })

    $(document).on('click', '#unsaved-memo-list dt', (e) => {
        e.stopPropagation();
        let word = $(e.target).text();
        $('#input-word').val(word);
        loadNoteInput();
    })

    $(document).on('click', '#unsaved-memo-list dd', (e) => {
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

function select() {
    $(".selected").removeClass("selected")
    let text = ''
    for (let i = selectionRange.left; i <= selectionRange.right; ++i) {
        let span = $("#span-" + String(i));
        span.addClass("selected");
        if (i > selectionRange.left) {
            if (spanIndexToGroupIndex[i] != spanIndexToGroupIndex[i - 1]) {
                text += ' ';
            }
        }
        text += spanIndexToText[i];
    }
    $("#input-word").val(text);
    showPossibleLemmas();
    loadNoteInput();
}

function showPossibleLemmas() {
    $('#possible-lemmas').empty();
    let word = $('#input-word').val();
    let lemmas = lemmatize(word);
    for (const lemma of lemmas) {
        $('<a></a>').attr('href', '#').addClass('nav-link').text(lemma).appendTo('#possible-lemmas');
    }
}

function parse(text) {
    let parsedText = [];
    for (let i = 0; i < text.length; ++i) {
        let c = text.charAt(i);
        if (onlyHangul(c)) {
            parsedText.push(c);
        } else if (c == '\n') {
            if (lastElement(parsedText) != '\n') {
                parsedText.push(c);
            }
        } else if (isBlank(c)) {
            if (!onlyHangul(lastElement(parsedText))) {
                parsedText[parsedText.length - 1] += c;
            } else {
                parsedText.push(c);
            }
        } else {
            let le = lastElement(parsedText);
            if (le != undefined && !(onlyHangul(le) || le == '\n')) {
                parsedText[parsedText.length - 1] += c;
            } else {
                parsedText.push(c);
            }
        }
    }
    return parsedText;
}

function generateHtml(text) {
    let spanIndex = 0;
    let div = $('<div></div>');
    let p = $('<p></p>');
    let parsedText = parse(text);
    let lastPart = '';
    for (const s of parsedText) {
        if (onlyHangul(s)) {
            if (onlyHangul(lastPart)) {
                lastElement(groups).push(spanIndex);
            } else {
                groups.push([spanIndex]);
            }
            let span = $('<span></span>');
            span.text(s);
            span.addClass('hangul');
            span.attr('id', 'span-' + String(spanIndex));
            spanIndexToText.push(s);
            ++spanIndex;
            p.append(span);
        } else if (s == '\n') {
            div.append(p);
            p = $('<p></p>');
            spanIndexToText.push(s);
            ++spanIndex;
        } else if (isBlank(s)) {
            p.append(s);
        } else {
            p.append(s);
            spanIndexToText.push(s);
            ++spanIndex;
        }
        lastPart = s;
    }
    if (p.text().length > 0) {
        div.append(p);
    }
    initSpanIndexToGroupIndex();
    return div.html();
}

function groupToText(group) {
    let s = ''
    for (const index of group) {
        s += spanIndexToText[index];
    }
    return s;
}

function initSpanIndexToGroupIndex() {
    let thisIndex = 0;
    for (let i = 0; i < groups.length; ++i) {
        while (thisIndex < groups[i][0]) {
            spanIndexToGroupIndex.push(-1);
            ++thisIndex;
        }
        for (const j of groups[i]) {
            spanIndexToGroupIndex.push(i);
            ++thisIndex;
        }
    }
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


function highlightParticles() {
    for (const group of groups) {
        let s = groupToText(group);
        let pid = indexParticle(s);
        let mainWordEnd = s.length;
        if (pid > -1) {
            mainWordEnd = pid;
            for (let i = pid; i < group.length; ++i) {
                let span = $("#span-" + String(group[i]));
                span.addClass("particle");
            }
        }
        let mainWord = s.substring(0, mainWordEnd);
        if (mainWord.length > 1 && mainWord in HANJA) {
            for (let i = 0; i < mainWordEnd; ++i) {
                let span = $("#span-" + String(group[i]));
                span.addClass("hanja-group");
            }
        }
    }
}

function selectWholeGroup(spanIndex) {
    let group = groups[spanIndexToGroupIndex[spanIndex]];
    let selection = []
    for (const id of group) {
        let span = $("#span-" + String(id));
        if (!span.hasClass('particle')) {
            selection.push(id);
        }
    }
    selection.sort();
    selectionRange.left = selection[0];
    selectionRange.right = selection[selection.length - 1];
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