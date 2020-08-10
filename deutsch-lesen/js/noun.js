class Noun {
    constructor(gender, sg, gen, pl, note=''){
        // Set gender
        switch (gender) {
            case 'der':
            case 'm':
                this.gender = 'm'
                break
            case 'die':
            case 'f':
                this.gender = 'f'
                break
            case 'das':
            case 'n':
                this.gender = 'n'
                break;
        }

        this.singular = sg
        this.genitive = gen
        this.plural = pl
        this.note = note
    }


}