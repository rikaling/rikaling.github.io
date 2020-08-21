$(()=>{
    $('#btn-lemmatize').click(()=>{
        let word = $('#input-word').val();
        let lemmas = lemmatize(word);
        $('#lemma-list').empty();
        for (const lemma of lemmas){
            $('<li></li>').text(lemma).addClass('list-group-item').appendTo('#lemma-list');
        }
    });

    $('#input-word').keypress((e)=>{
        if (e.code == 'Enter'){
            e.preventDefault();
            $('#btn-lemmatize').click()
        }
    })

})