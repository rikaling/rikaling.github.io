$(() => {
    $('#btn-submit-finite').click((e) => {
        $('#infinitives').empty();
        e.preventDefault();
        let finite = $('#input-finite').val();
        let infinitives = inferInfinitive(finite);
        for (const infinitive of infinitives) {
            $('<li></li>').text(infinitive).appendTo('#infinitives')
        }
    })
})