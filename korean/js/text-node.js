class TextNode {
    constructor(text, textInstance, prev = null, next = null) {
        this._text = text;
        this._textInstance = textInstance;
        this._prev = prev;
        this._next = next;
        this._element = null;
        this._selected = false;
        this._isParticle = false;
        this._isHanja = false;
    }

    click(ctrlKey) {
        if (this._textInstance.selected) {
            if (this._textInstance.selectionRange.right.next == this) {
                this.select();
                this._textInstance.selectionRange.right = this;
            } else if (this._textInstance.selectionRange.left.prev == this) {
                this.select();
                this._textInstance.selectionRange.left = this;
            } else if (ctrlKey) {
                if (this.after(this._textInstance.selectionRange.right) &&
                    TextNode.hasOnlyBlankBetween(this, this._textInstance.selectionRange.right)) {
                    this.select();
                    this._textInstance.selectionRange.right = this;
                } else if (this.before(this._textInstance.selectionRange.left) &&
                    TextNode.hasOnlyBlankBetween(this, this._textInstance.selectionRange.left)) {
                    this.select();
                    this._textInstance.selectionRange.left = this;
                } else {
                    this.selectGroup();
                }
            } else {
                this._textInstance.select(this);
            }
        } else {
            if (ctrlKey) {
                this.selectGroup();
            } else {
                this._textInstance.select(this);
            }
        }
    }

    select() {
        if (this._element == null) {
            return;
        }
        this._element.addClass('selected');
        console.log(this._element)
        this._selected = true;
        console.log(this._textInstance.selectionRange)
    }

    selectGroup() {
        let groupStart = this;
        let groupEnd = this;
        while (groupStart.prev != null && groupStart.prev.isHangul) {
            groupStart = groupStart.prev;
        }
        while (groupEnd.next != null && groupEnd.next.isHangul && !groupEnd.next.isParticle) {
            groupEnd = groupEnd.next;
        }
        this._textInstance.selectRange(groupStart, groupEnd);
    }

    unselect() {
        if (this._element == null) {
            return;
        }
        this._element.removeClass('selected');
    }


    nextTo(node) {
        return this.justAfter(node) || this.justBefore(node);
    }

    justAfter(node) {
        return this.prev == node;
    }

    justBefore(node) {
        return this.next == node;
    }

    after(node) {
        let curNode = node.next;
        while (curNode != null) {
            if (curNode == this) {
                return true;
            }
            curNode = curNode.next;
        }
        return false;
    }

    before(node) {
        let curNode = node.prev;
        while (curNode != null) {
            if (curNode == this) {
                return true;
            }
            curNode = curNode.prev;
        }
        return false;
    }

    prevN(n = 1) {
        let curNode = this;
        while (curNode != null && n > 0) {
            curNode = curNode.prev;
            --n;
        }
        return curNode;
    }

    nextN(n = 1) {
        let curNode = this;
        while (curNode != null && n > 0) {
            curNode = curNode.next;
            --n;
        }
        return curNode;
    }



    static hasBetween(n1, n2) {
        let between = {
            newline: false,
            blank: false,
            hangul: false,
            other: false
        }
        if (n1 == n2) {
            return between;
        }
        if (n1.before(n2)) {
            var startNode = n1;
            var endNode = n2;
        } else {
            var startNode = n2;
            var endNode = n1;
        }
        let curNode = startNode.next;
        while (curNode != endNode) {
            if (curNode.isNewline) {
                between.newline = true;
            } else if (curNode.isBlank) {
                between.blank = true;
            } else if (curNode.isHangul) {
                between.hangul = true;
            } else {
                between.other = true;
            }
            curNode = curNode.next;
        }
        return between;
    }

    static hasOnlyBlankBetween(n1, n2) {
        let between = TextNode.hasBetween(n1, n2);
        return between.blank && !(between.hangul || between.newline || between.other);
    }

    static each(fp, start, end) {
        let curNode = start;
        while (curNode != end.next) {
            fp(curNode);
            curNode = curNode.next;
        }
    }

    static textInRange(start, end) {
        if (start==null||end==null){
            return '';
        }
        let t = '';
        TextNode.each((node) => {
            t += node.text;
        }, start, end);
        return t;
    }

    get isParticle() {
        return this._isParticle;
    }

    set isParticle(v) {
        this._isParticle = v;
    }

    get isHanja() {
        return this._isHanja;
    }

    set isHanja(v) {
        this._isHanja = v;
    }

    get selected() {
        return this._selected();
    }

    get text() {
        return this._text;
    }

    set text(v) {
        this._text = v;
    }

    get prev() {
        return this._prev;
    }

    set prev(p) {
        this._prev = p;
    }

    get next() {
        return this._next;
    }

    set next(n) {
        this._next = n;
    }

    get element() {
        return this._element;
    }

    set element(e) {
        this._element = e;
    }

    get isHangul() {
        return onlyHangul(this.text);
    }

    get isBlank() {
        return isBlank(this.text);
    }

    get isNewline() {
        return this.text == '\n';
    }

    get isOther() {
        return !(this.isHangul || this.isBlank || this.isNewline);
    }








}