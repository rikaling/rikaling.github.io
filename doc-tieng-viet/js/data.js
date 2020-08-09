'use strict';

// Hashmap of unsaved memos
var memos = {}

function saveChanges() {
    let changed = false;
    for (const word in memos) {
        if (!word in memoDict || memos[word] != memoDict[word]) {
            changed = true;
            if (memos[word].length == 0) {
                delete memoDict[word]
            } else {
                memoDict[word] = memos[word]
            }
        }
    }
    if (changed) {
        try {
            download(JSON.stringify(memoDict, null, 2), 'memos.json', 'text/plain');
            $("#save-memos").removeClass('btn-outline-primary').removeClass('btn-outline-danger').addClass('btn-outline-success')
        } catch (error) {
            console.log(error)
            $('#save-memos').removeClass('btn-outline-primary').removeClass('btn-outline-success').addClass('btn-outline-danger')
        }
    }
}
