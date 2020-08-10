class Verb {
    constructor(infinitive){
        this.infinitive = infinitive
    }
}

class WeakVerb extends Verb {

    constructor(infinitive){
        super(infinitive)
        if (infinitive.endsWith('en')){
            let stem = infinitive.substring(0, infinitive.length - 2);
            this.stem = stem
            this.suffix = 'en'
            if (stem.endsWith('d') || stem.endsWith('t') || stem.endsWith('chn') || stem.endsWith('dn') || stem.endsWith('fn') || stem.endsWith('gn') || stem.endsWith('tm')){
                this.type = 'ten'
            } else {
                this.type = 'en'
            }
        } else if (infinitive.endsWith('n')){
            this.stem = infinitive.substring(0, infinitive.length - 1);
            this.suffix = 'n'
            if (this.stem.endsWith('er')){
                this.type = 'ern'
            } else if (this.stem.endsWith('el')){
                this.type = 'eln'
            }
        }
    }

    static conjugateEnVerb(verb, person, number, tense, mood){
        let stem = verb.stem
        

    }

    presentIndicative(person){

    }

    pastIndicative(person){

    }

    static conjugatePresentIndicative(verb, person, number){
        let finite = ''
        if (number == 'pl'){
            switch (person) {
                case 1:
                case 3:
                    finite = verb.infinitive
                    break;
                case 2:
                    break
                default:
                    break;
            }
        } else {
            switch (person) {
                case 1:
                    
                    break;
                case 2:
                    break;

                case 3:
                    break;

            
                default:
                    break;
            }

        }

        let stem = verb.stem
        let suffix = verb.suffix
       

    }

    conjugate(person, number, tense, mood) {

    }






}


class StrongVerb extends Verb {

}