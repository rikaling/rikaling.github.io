const CONSONANT_PARTICLES = ['이라고', '은', '이', '을', '과', '이랑', '으로'];
const VOWEL_PARTICLES = ['라고', '는', '가', '를', '와', '랑', '로'];
const BOTH_PARTICLES = ['만', '의', '에', '에게', '한테', '에서', '에서는', '도', '부터'];
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
