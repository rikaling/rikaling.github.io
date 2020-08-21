'use strict';

class StatusQueue {
    constructor() {
        this._head = null;
        this._tail = null;
    }

    push(status){
        let node = new StatusNode(status);
        if (this.empty){
            this._head = node;
        }else{
            this._tail.next = node;
            node.prev = this._tail;
        }
        this._tail = node;
    }

    extends(list){
        for (const status of list){
            this.push(status);
        }
    }

    shift(){
        if (this.empty){
            return null;
        }
        let status = this._head.status;
        this._head = this._head.next;
        return status;
    }

    get empty(){
        return this._head === null;
    }
}


class StatusNode {
    constructor(status, prev = null, next = null) {
        this._status = status;
        this._prev = prev;
        this._next = next;
    }

    get status() {
        return this._status;
    }

    get prev() {
        return this._prev;
    }

    get next() {
        return this._next;
    }

    set prev(n) {
        this._prev = n;
    }

    set next(n) {
        this._next = n;
    }

}