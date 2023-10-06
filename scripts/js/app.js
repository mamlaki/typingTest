"use strict";
var typingArea = document.querySelector('.typing-area');
var startBtn = document.querySelector('.start-btn');
var sampleTexts = ['Sample text 1', 'Sample text 2', 'Sample text 3'];
var currentPosition = 0;
var currentPrompt = '';
if (startBtn && typingArea) {
    startBtn.addEventListener('click', function () {
        currentPrompt = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        typingArea.textContent = currentPrompt;
        currentPosition = 0;
        setCursorAtStart(typingArea);
    });
    typingArea.addEventListener('input', function (e) {
        var plainText = typingArea.textContent ? typingArea.textContent.replace(/<[^>]*>/g, "") : "";
        if (plainText[currentPosition] === currentPrompt[currentPosition]) {
            applyCharacterStyle('correct');
        }
        else {
            applyCharacterStyle('incorrect');
        }
        currentPosition++;
    });
}
function applyCharacterStyle(className) {
    if (typingArea) {
        var charToStyle = currentPrompt[currentPosition];
        var preText = currentPrompt.substring(0, currentPosition);
        var postText = currentPrompt.substring(currentPosition + 1);
        var styledChar = "<span class=\"".concat(className, "\">").concat(charToStyle, "</span>");
        typingArea.innerHTML = preText + styledChar + postText;
        setCursorAfterStyledChar(typingArea, currentPosition);
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
    var styledSpan = element.querySelectorAll('span')[0];
    if (styledSpan) {
        range.setStartAfter(styledSpan);
        range.collapse(true);
        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
    }
}
//# sourceMappingURL=app.js.map