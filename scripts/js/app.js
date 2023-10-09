"use strict";
var typingArea = document.querySelector('.typing-area');
var startBtn = document.querySelector('.start-btn');
var countdownElement = document.querySelector('.countdown');
var sampleTexts = ['Sample text 1', 'Sample text 2', 'Sample text 3'];
var currentPosition = 0;
var currentPrompt = '';
var userInput = [];
var countdownTimer = null;
var countdownValue = 0;
function loadNewPrompt() {
    currentPrompt = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    typingArea.innerHTML = currentPrompt.split('').map(function (char) { return "<span>".concat(char, "</span>"); }).join('');
    currentPosition = 0;
    setCursorAtStart(typingArea);
    typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.remove('typing-in-progress');
    userInput = [];
}
if (startBtn && typingArea) {
    typingArea.classList.add('unfocused');
    loadNewPrompt();
    typingArea.focus();
    typingArea.classList.remove('unfocused');
    startBtn.addEventListener('click', function () {
        loadNewPrompt();
    });
    var lockedPositions_1 = [];
    typingArea.addEventListener('keydown', function (e) {
        var _a;
        console.log("Key Pressed: ".concat(e.key));
        console.log("Initial Current Position: ".concat(currentPosition));
        e.preventDefault();
        var getWordStartPosition = function (pos) {
            var tempPos = (pos - 1 < 0) ? 0 : pos - 1;
            var startPos = currentPrompt.lastIndexOf(' ', tempPos) + 1;
            if (startPos < 0)
                startPos = 0;
            return startPos;
        };
        var getWordEndPosition = function (pos) {
            var endPos = currentPrompt.indexOf(' ', pos);
            if (endPos === -1)
                endPos = currentPrompt.length;
            return endPos;
        };
        var isWordCorrect = function (start, end) {
            return currentPrompt.substring(start, end) === userInput.slice(start, end).join('');
        };
        var hasStartedTypingCurrentWord = function () {
            var currentWordStart = getWordStartPosition(currentPosition);
            return userInput.slice(currentWordStart, currentPosition).join('').length > 0;
        };
        var markUntypedAsIncorrect = function (start, end) {
            for (var i = start; i < end; i++) {
                if (typeof userInput[i] === 'undefined') {
                    applyCharacterStyle('incorrect', i);
                }
            }
        };
        if (e.key === 'Backspace' && currentPosition > 0) {
            var currentWordStart = getWordStartPosition(currentPosition);
            var prevWordStart = getWordStartPosition(currentPosition - 1);
            console.log("Current Word Start: ".concat(currentWordStart));
            console.log("Previous Word Start: ".concat(prevWordStart));
            console.log("Locked Positions: ".concat(lockedPositions_1));
            if (currentPosition > currentWordStart || !lockedPositions_1.includes(prevWordStart)) {
                currentPosition--;
                resetCharacterStyle(currentPosition);
            }
            else {
                console.log('Trying to backspace into a locked position. Operation blocked.');
                return;
            }
        }
        else if (e.key === ' ') {
            if (!hasStartedTypingCurrentWord()) {
                console.log('Cannot skip word without typing.');
                return;
            }
            var previousWordStart = getWordStartPosition(currentPosition);
            var previousWordEnd = currentPosition;
            if (!isWordCorrect(previousWordStart, previousWordEnd)) {
                markUntypedAsIncorrect(previousWordEnd, getWordEndPosition(currentPosition));
            }
            if (isWordCorrect(previousWordStart, previousWordEnd)) {
                console.log('Locking Previous Word Start: ', previousWordStart);
                if (!lockedPositions_1.includes(previousWordStart)) {
                    lockedPositions_1.push(previousWordStart);
                }
            }
            else if (lockedPositions_1.includes(previousWordStart)) {
                var index = lockedPositions_1.indexOf(previousWordStart);
                lockedPositions_1.splice(index, 1);
            }
            var nextSpacePosition = currentPrompt.indexOf(' ', currentPosition);
            if (nextSpacePosition === -1) {
                nextSpacePosition = currentPrompt.length;
            }
            currentPosition = nextSpacePosition + 1;
        }
        else if (e.key.length === 1 && currentPosition < currentPrompt.length) {
            var charTyped = e.key;
            userInput[currentPosition] = charTyped;
            if (charTyped === currentPrompt[currentPosition]) {
                applyCharacterStyle('correct');
            }
            else {
                applyCharacterStyle('incorrect');
            }
            currentPosition++;
        }
        console.log("End Current Position: ".concat(currentPosition));
        setCursorAfterStyledChar(typingArea, currentPosition);
        if (!hasStartedTyping) {
            var activeTime = ((_a = document.querySelector('.time-selection.active')) === null || _a === void 0 ? void 0 : _a.textContent) || '15';
            countdownValue = parseInt(activeTime);
            if (countdownElement) {
                countdownElement.textContent = countdownValue.toString();
                countdownElement.style.opacity = '1';
                countdownElement.style.transition = 'opacity 0.3s ease';
            }
            countdownTimer = setInterval(function () {
                countdownValue--;
                if (countdownElement) {
                    countdownElement.textContent = countdownValue.toString();
                }
                if (countdownValue <= 0) {
                    if (countdownElement) {
                        countdownElement.textContent = 'Done.';
                    }
                    if (countdownTimer !== null) {
                        clearInterval(countdownTimer);
                    }
                    typingArea === null || typingArea === void 0 ? void 0 : typingArea.setAttribute('contenteditable', 'false');
                }
            }, 1000);
            hasStartedTyping = true;
        }
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
function applyCharacterStyle(className, position) {
    if (position === void 0) { position = currentPosition; }
    if (typingArea) {
        var targetNode = typingArea.childNodes[position];
        if (targetNode) {
            targetNode.className = className;
            setCursorAfterStyledChar(typingArea, position + 1);
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