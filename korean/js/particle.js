const CONSONANT_PARTICLES = ['이라고', '은', '이', '을', '과', '과의','이랑', '으로'];
const VOWEL_PARTICLES = ['라고', '는', '가', '를', '와','와의', '랑', '로'];
const BOTH_PARTICLES = ['만', '의', '에', '에게', '한테', '에서', '도', '부터', '에게서', '하고', '조차'];
const neun = '는';

var particles = CONSONANT_PARTICLES.concat(VOWEL_PARTICLES).concat(BOTH_PARTICLES);

particles.sort((a, b) => {
    return b.length - a.length;
})

function indexParticle(s) {
    for (const p of particles) {
        if (s.endsWith(p)) {
            return s.length - p.length;
        }
    }
    return -1;
}


class Particle {

    static particles = [];

    constructor(word, afterVowel = true, afterConsonant = true) {
        this._word = word;
        this._afterVowel = afterVowel;
        this._afterConsonant = afterConsonant;
    }

    get word() {
        return this._word;
    }

    get afterVowel() {
        return this._afterVowel;
    }

    get afterConsonant() {
        return this._afterConsonant;
    }

    after(noun) {
        if (noun == undefined || noun.length == 0) {
            return false;
        }
        if (hasFinalConsonant(noun.charAt(noun.length - 1))) {
            if (this._word == '로' && decompose(noun.charAt(noun.length - 1)).finalConsonant == 'ㄹ') {
                return true;
            }
            return this.afterConsonant;
        }
        return this.afterVowel;
    }

    static index(s) {
        let index = s.length;
        for (const p of Particle.particles) {
            if (s.endsWith(p.word)) {
                index = s.length - p.word.length;
                if (p.after(s.substring(0, index))) {
                    return index;
                }
            }
        }
        return s.length;
    }

    static getParticle(p) {
        for (const particle of Particle.particles) {
            if (particle.word == p) {
                return particle;
            }
        }
    }

    static check(p, s) {
        if (s.endsWith(p)) {
            let pid = s.lastIndexOf(p);
            let particle = Particle.getParticle(p);
            return particle.after(s.substring(0, pid));
        } else {
            return false;
        }
    }


}



for (const p of CONSONANT_PARTICLES) {
    Particle.particles.push(new Particle(p, false));
}
for (const p of VOWEL_PARTICLES) {
    Particle.particles.push(new Particle(p, true, false));
}
for (const p of BOTH_PARTICLES) {
    Particle.particles.push(new Particle(p));
}
Particle.particles.sort((a, b) => {
    return b.word.length - a.word.length;
})