'use strict';
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
        return this._root.nextN(id);
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

    /** 
     * Select selects the only node and clear other selection
     * @param {TextNode} node
     */
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
        let p = $('<p></p>');
        let curNode = this.root;
        while (curNode != null) {
            if (curNode.isHangul) {
                let span = $('<span></span>')
                    .text(curNode.text)
                    .data('node', curNode)
                    .addClass('hangul');
                curNode.element = span;
                if (curNode.isParticle) {
                    span.addClass('particle');
                }
                if (curNode.isHanja) {
                    span.addClass('hanja');
                }
                p.append(span);
            } else if (curNode.isNewline) {
                container.append(p);
                p = $('<p></p>');
            } else if (curNode.isBlank) {
                p.append(curNode.text);
            } else {
                p.append(curNode.text);
            }
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
                    if ((curNode.text == '은' || curNode.text == '는') && Particle.check(curNode.text, hangulString)) {
                        curNode.isParticle = true;
                        if (curNode.prev.isHangul) {
                            hangulEnd = curNode.prev;
                        } else {
                            hangulEnd = null;
                        }
                    }
                    if (hangulEnd != null) {
                        hangulString = TextNode.textInRange(hangulStart, hangulEnd);
                        let pid = Particle.index(hangulString);
                        let particleNode = hangulStart.nextN(pid);
                        TextNode.each((n) => {
                            n.isParticle = true;
                        }, particleNode, hangulEnd);
                        if (particleNode != null) {
                            hangulEnd = particleNode.prev;
                        }
                        if (pid > 1 && hangulString.substring(0, pid) in HANJA) {
                            TextNode.each((n) => {
                                n.isHanja = true;
                            }, hangulStart, hangulEnd);
                        }
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