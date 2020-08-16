$(() => {
    $('#btn-input-verb').click((e) => {
        e.preventDefault()
        let verb = new WeakVerb($('#input-verb').val());
        $('<td></td>').text(verb.presentIndicative(1))
            .appendTo('#conjugation-table tr:nth-child(2)')
        $('<td></td>').text(verb.pastIndicative(1))
            .appendTo('#conjugation-table tr:nth-child(2)')
        $('<td></td>').text(verb.subjunctiveI(1))
            .appendTo('#conjugation-table tr:nth-child(2)')
        $('<td></td>').text(verb.subjunctiveII(1))
            .appendTo('#conjugation-table tr:nth-child(2)')
        $('<td></td>').text(verb.presentIndicative(2))
            .appendTo('#conjugation-table tr:nth-child(3)')
        $('<td></td>').text(verb.pastIndicative(2))
            .appendTo('#conjugation-table tr:nth-child(3)')
        $('<td></td>').text(verb.subjunctiveI(2))
            .appendTo('#conjugation-table tr:nth-child(3)')
        $('<td></td>').text(verb.subjunctiveII(2))
            .appendTo('#conjugation-table tr:nth-child(3)')
        $('<td></td>').text(verb.presentIndicative(3))
            .appendTo('#conjugation-table tr:nth-child(4)')
        $('<td></td>').text(verb.pastIndicative(3))
            .appendTo('#conjugation-table tr:nth-child(4)')
        $('<td></td>').text(verb.subjunctiveI(3))
            .appendTo('#conjugation-table tr:nth-child(4)')
        $('<td></td>').text(verb.subjunctiveII(3))
            .appendTo('#conjugation-table tr:nth-child(4)')
        $('<td></td>').text(verb.presentIndicative(1, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(5)')
        $('<td></td>').text(verb.pastIndicative(1, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(5)')
        $('<td></td>').text(verb.subjunctiveI(1, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(5)')
        $('<td></td>').text(verb.subjunctiveII(1, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(5)')
        $('<td></td>').text(verb.presentIndicative(2, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(6)')
        $('<td></td>').text(verb.pastIndicative(2, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(6)')
        $('<td></td>').text(verb.subjunctiveI(2, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(6)')
        $('<td></td>').text(verb.subjunctiveII(2, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(6)')
        $('<td></td>').text(verb.presentIndicative(3, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(7)')
        $('<td></td>').text(verb.pastIndicative(3, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(7)')
        $('<td></td>').text(verb.subjunctiveI(3, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(7)')
        $('<td></td>').text(verb.subjunctiveII(3, 'pl'))
            .appendTo('#conjugation-table tr:nth-child(7)')
    })
})