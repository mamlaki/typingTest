"use strict";
var typingArea = document.querySelector('.typing-area');
var startBtn = document.querySelector('.start-btn');
var sampleTexts = ['Sample text 1', 'Sample text 2', 'Sample text 3'];
var currentPosition = 0;
var currentPrompt = '';
function loadNewPrompt() {
    currentPrompt = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    typingArea.innerHTML = currentPrompt.split('').map(function (char) { return "<span>".concat(char, "</span>"); }).join('');
    currentPosition = 0;
    setCursorAtStart(typingArea);
    typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.remove('typing-in-progress');
}
if (startBtn && typingArea) {
    typingArea.classList.add('unfocused');
    loadNewPrompt();
    typingArea.focus();
    typingArea.classList.remove('unfocused');
    startBtn.addEventListener('click', function () {
        loadNewPrompt();
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
    typingArea.addEventListener('click', function (e) {
        e.preventDefault();
        setCursorAfterStyledChar(typingArea, currentPosition);
    });
    typingArea.addEventListener('focus', function () {
        typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.remove('unfocused');
        setCursorAfterStyledChar(typingArea, currentPosition);
    });
    typingArea.addEventListener('blur', function () {
        typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.add('unfocused');
    });
}
var focusMessage = document.querySelector('.focus-message');
if (focusMessage) {
    focusMessage.addEventListener('click', function () {
        typingArea === null || typingArea === void 0 ? void 0 : typingArea.focus();
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
    var styledSpans = element.querySelectorAll('span');
    var targetSpan = styledSpans[position - 1];
    if (targetSpan) {
        var spanRect = targetSpan.getBoundingClientRect();
        var containerRect = element.getBoundingClientRect();
        var leftDistance = spanRect.left - containerRect.left + spanRect.width;
        element.style.setProperty('--cursor-translate-x', "".concat(leftDistance, "px"));
    }
    else {
        element.style.removeProperty('--cursor-translate-x');
    }
}
var timeSelections = document.querySelectorAll('.time-selection');
timeSelections.forEach(function (timeSelection) {
    timeSelection.addEventListener('click', function (e) {
        e.preventDefault();
        timeSelections.forEach(function (element) { return element.classList.remove('active'); });
        timeSelection.classList.add('active');
    });
});
var hasStartedTyping = false;
function hideUIElements() {
    var footer = document.querySelector('footer');
    var toolbar = document.querySelector('.toolbar');
    if (footer)
        footer.classList.add('hidden');
    if (toolbar)
        toolbar.classList.add('hidden');
}
function showUIElements() {
    var footer = document.querySelector('footer');
    var toolbar = document.querySelector('.toolbar');
    if (footer)
        footer.classList.remove('hidden');
    if (toolbar)
        toolbar.classList.remove('hidden');
}
typingArea === null || typingArea === void 0 ? void 0 : typingArea.addEventListener('keydown', function (e) {
    var isFooterVisible = document.querySelector('footer:not(.hidden)');
    var isToolbarVisible = document.querySelector('.toolbar:not(.hidden)');
    if (!hasStartedTyping || (hasStartedTyping && (isFooterVisible || isToolbarVisible))) {
        hideUIElements();
        hasStartedTyping = true;
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        startBtn === null || startBtn === void 0 ? void 0 : startBtn.focus();
    }
    typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.add('typing-in-progress');
});
document.addEventListener('mousemove', function () {
    if (hasStartedTyping) {
        showUIElements();
    }
});
document.addEventListener('click', function (e) {
    if (hasStartedTyping && e.target !== typingArea) {
        showUIElements();
    }
});
//# sourceMappingURL=app.js.map