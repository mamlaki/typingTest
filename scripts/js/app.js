"use strict";
var typingArea = document.querySelector('.typing-area');
var startBtn = document.querySelector('.start-btn');
var sampleTexts = ['Sample text 1', 'Sample text 2', 'Sample text 3'];
var currentPosition = 0;
var currentPrompt = '';
if (startBtn && typingArea) {
    startBtn.addEventListener('click', function () {
        currentPrompt = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        typingArea.innerHTML = currentPrompt.split('').map(function (char) { return "<span>".concat(char, "</span>"); }).join('');
        currentPosition = 0;
        setCursorAtStart(typingArea);
    });
    typingArea.addEventListener('keydown', function (e) {
        e.preventDefault();
        if (e.key === 'Backspace' && currentPosition > 0) {
            currentPosition--;
            resetCharacterStyle(currentPosition);
        }
        else if (e.key.length === 1 && currentPosition < currentPrompt.length) {
            var charTyped = e.key;
            if (charTyped === currentPrompt[currentPosition]) {
                applyCharacterStyle('correct');
            }
            else {
                applyCharacterStyle('incorrect');
            }
            currentPosition++;
        }
        setCursorAfterStyledChar(typingArea, currentPosition);
    });
    typingArea.addEventListener('click', function () {
        var _a;
        var caretPos = ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorOffset) || 0;
        currentPosition = caretPos;
    });
}
function applyCharacterStyle(className) {
    if (typingArea) {
        var targetNode = typingArea.childNodes[currentPosition];
        if (targetNode) {
            targetNode.className = className;
            setCursorAfterStyledChar(typingArea, currentPosition + 1);
        }
    }
}
function resetCharacterStyle(position) {
    if (typingArea) {
        var targetNode = typingArea.childNodes[position];
        if (targetNode) {
            targetNode.classList.remove('correct', 'incorrect');
            setCursorAfterStyledChar(typingArea, position);
        }
    }
}
function setCursorAtStart(element) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(element, 0);
    range.collapse(true);
    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    sel === null || sel === void 0 ? void 0 : sel.addRange(range);
    element.focus();
}
function setCursorAfterStyledChar(element, position) {
    var range = document.createRange();
    var sel = window.getSelection();
    var styledSpan = element.querySelectorAll('span')[position - 1];
    if (styledSpan) {
        range.setStartAfter(styledSpan);
    }
    else {
        range.setStart(element.childNodes[0], position);
    }
    range.collapse(true);
    sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
    sel === null || sel === void 0 ? void 0 : sel.addRange(range);
}
//# sourceMappingURL=app.js.map