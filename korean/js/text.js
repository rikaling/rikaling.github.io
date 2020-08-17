class Text {
    constructor(text) {
        this.parse(text)
        this.selectionRange = {
            left: null,
            right: null
        };
    }


    get root() {
        return this._root;
    }

    set root(root) {
        this._root = root;
    }

    get selected() {
        return !(this.selectionRange.left == null || this.selectionRange.right == null);
    }


    get selectedText() {
        return TextNode.textInRange(this.selectionRange.left, this.selectionRange.right);
    }

    setSelectionRange(left, right) {
        this.selectionRange.left = left;
        this.selectionRange.right = right;
    }


    getNode(id) {
        let curNode = this._root;
        while (id > 0) {
            curNode = curNode.next;
            --id;
        }
        return curNode;
    }

    clearSelection() {
        if (!this.selected) {
            return;
        }
        TextNode.each((node) => {
            node.unselect();
        }, this.selectionRange.left, this.selectionRange.right);
        this.setSelectionRange(null, null);
    }





    select(node) {
        this.clearSelection();
        this.setSelectionRange(node, node);
        node.select();
    }

    selectRange(start = this.selectionRange.left, end = this.selectionRange.right) {
        this.clearSelection()
        this.setSelectionRange(start, end);
        TextNode.each((node) => {
            node.select();
        }, start, end);
    }

    generateHtml(container) {
        let nodeIndex = 0;
        let p = $('<p></p>');
        let curNode = this.root;
        while (curNode != null) {
            if (curNode.isHangul) {
                let span = $('<span></span>');
                span.text(curNode.text);
                curNode.element = span;
                span.addClass('hangul');
                if (curNode.isParticle) {
                    span.addClass('particle');
                }
                if (curNode.isHanja) {
                    span.addClass('hanja');
                }
                span.attr('id', 'node-' + String(nodeIndex));
                p.append(span);
            } else if (curNode.isNewline) {
                container.append(p);
                p = $('<p></p>');
            } else if (curNode.isBlank) {
                p.append(curNode.text);
            } else {
                p.append(curNode.text);
            }
            ++nodeIndex;
            curNode = curNode.next;
        }
        if (p.html().length > 0) {
            container.append(p);
        }
    }

    parse(text) {
        let curNode = null;
        let root = null;
        let hangulStart = null;
        let hangulEnd = null;
        for (let i = 0; i < text.length; ++i) {
            let c = text.charAt(i);
            if (onlyHangul(c)) {
                let node = new TextNode(c, this, curNode);
                if (curNode != null) {
                    curNode.next = node;
                }
                if (curNode == null || !curNode.isHangul) {
                    hangulStart = node;
                }
                curNode = node;
            } else {
                if (curNode.isHangul) {
                    hangulEnd = curNode;
                    let hangulString = TextNode.textInRange(hangulStart, hangulEnd);
                    let pid = indexParticle(hangulString);
                    let mainWordEnd = hangulString.length;
                    if (pid > -1) {
                        mainWordEnd = pid;
                        let particleNode = hangulStart.nextN(pid);
                        TextNode.each((n) => {
                            n.isParticle = true;
                        }, particleNode, hangulEnd);
                        hangulEnd = particleNode.prev;
                    }
                    if (hangulString.substring(0, mainWordEnd) in HANJA) {
                        TextNode.each((n) => {
                            n.isHanja = true;
                        }, hangulStart, hangulEnd);
                    }
                }
                if (c == '\n') {
                    if (!curNode.isNewline) {
                        let node = new TextNode(c, this, curNode);
                        if (curNode != null) {
                            curNode.next = node;
                        }
                        curNode = node;
                    }
                } else if (isBlank(c)) {
                    if (curNode.isHangul) {
                        let node = new TextNode(c, this, curNode);
                        if (curNode != null) {
                            curNode.next = node;
                        }
                        curNode = node;
                    } else {
                        curNode.text += c;
                    }
                } else {
                    if (curNode != null && !(curNode.isHangul || curNode.isNewline)) {
                        curNode.text += c;
                    } else {
                        let node = new TextNode(c, this, curNode);
                        if (curNode != null) {
                            curNode.next = node;
                        }
                        curNode = node;
                    }
                }
            }
            if (i == 0) {
                root = curNode;
            }
        }
        if (curNode.isHangul) {
            hangulEnd = curNode;
            let hangulString = TextNode.textInRange(hangulStart, hangulEnd);
            let pid = indexParticle(hangulString);
            if (pid > -1) {
                let particleNode = hangulStart.nextN(pid);
                TextNode.each((n) => {
                    n.isParticle = true;
                }, particleNode, hangulEnd);
            }
        }
        this._root = root;
    }
}