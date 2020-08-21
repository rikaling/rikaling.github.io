'use strict';

class Status {
    constructor(word) {
        this._word = word;
    }

    get word() {
        return this._word;
    }

    move() {

    }

    
    get isStem(){
        return this instanceof StemStatus;
    }
}

class InitialStatus extends Status {
    constructor(word) {
        super(word);
    }

    move() {
        let nextStatus = [new StemStatus(this._word)]
        if (this._word.endsWith('e')) {
            nextStatus.push(new E1Status(this._word));
            nextStatus.push(new E2Status(this._word));
        }
        if (this._word.endsWith('t')) {
            nextStatus.push(new TStatus(this._word));
        }
        if (this._word.endsWith('st')) {
            nextStatus.push(new StStatus(this._word));
        }
        if (this._word.endsWith('te')) {
            nextStatus.push(new TeStatus(this._word));
        }
        if (this._word.endsWith('en') || this._word.endsWith('eln')||this._word.endsWith('ern')||this._word.endsWith('tun')||this._word == 'sein') {
            nextStatus.push(new EnStatus(this._word));
        }
        return nextStatus;
    }

}


class StemStatus extends Status {
    move() {
        return [];
    }
}

class E1Status extends Status {
    move() {
        let nextStatus = [];
        nextStatus.push(new StemStatus(this._word.substring(0, this._word.length - 1)));
        return nextStatus;
    }
}

class E2Status extends Status {
    move() {
        let nextStatus = [];
        nextStatus.push(new StemStatus(this._word.substring(0, this._word.length - 1)));
        return nextStatus;
    }
}

class StStatus extends Status {
    move() {
        let nextStatus = [];
        let noSuf = this._word.substring(0, this._word.length - 2);
        nextStatus.push(new StemStatus(noSuf));
        if (noSuf.endsWith('e')) {
            nextStatus.push(new StemStatus(noSuf.substring(0, noSuf.length - 1)));
            nextStatus.push(new E2Status(noSuf));
        }
        if (noSuf.endsWith('te')) {
            nextStatus.push(new TeStatus(noSuf));
        }
        return nextStatus;
    }
}

class EnStatus extends Status {
    move() {
        let nextStatus = [];
        if (this._word.endsWith('en')){
            nextStatus.push(new StemStatus(this._word.substring(0, this._word.length - 2)));
            nextStatus.push(new E2Status(this._word.substring(0, this._word.length - 1)));
            if (this._word.endsWith('ten')) {
                nextStatus.push(new TeStatus(this._word.substring(0, this._word.length - 1)));
            }
        }else{
            nextStatus.push(new StemStatus(this._word.substring(0, this._word.length - 1)));
        }
        return nextStatus;
    }
}

class TeStatus extends Status {
    move() {
        let nextStatus = [];
        let noSuf = this._word.substring(0, this._word.length - 2);
        nextStatus.push(new StemStatus(noSuf));
        if (noSuf.endsWith('e')) {
            nextStatus.push(new StemStatus(noSuf.substring(0, noSuf.length - 1)));
        }
        return nextStatus;
    }
}

class TStatus extends Status {
    move() {
        let nextStatus = [];
        let noSuf = this._word.substring(0, this._word.length - 1);
        nextStatus.push(new StemStatus(noSuf));
        if (noSuf.endsWith('e')) {
            nextStatus.push(new StemStatus(noSuf.substring(0, noSuf.length - 1)));
            nextStatus.push(new E2Status(noSuf));
        }
        if (noSuf.endsWith('te')) {
            nextStatus.push(new TeStatus(noSuf));
        }
        return nextStatus;
    }
}