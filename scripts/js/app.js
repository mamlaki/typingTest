var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getRandomWords } from "./getRandomWords.js";
var typingArea = document.querySelector('.typing-area');
var startBtn = document.querySelector('.start-btn');
var countdownElement = document.querySelector('.countdown');
var currentPosition = 0;
var currentPrompt = '';
var userInput = [];
var countdownTimer = null;
var countdownValue = 0;
function loadNewPrompt() {
    return __awaiter(this, void 0, void 0, function () {
        var words, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getRandomWords(80, 8)];
                case 1:
                    words = _a.sent();
                    currentPrompt = words.join(' ');
                    typingArea.innerHTML = currentPrompt.split('').map(function (char) { return "<span>".concat(char, "</span>"); }).join('');
                    currentPosition = 0;
                    setCursorAtStart(typingArea);
                    typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.remove('typing-in-progress');
                    userInput = [];
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error in loadNewPrompt:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function resetTimer() {
    var _a;
    if (countdownTimer !== null) {
        clearInterval(countdownTimer);
    }
    var activeTime = ((_a = document.querySelector('.time-selection.active')) === null || _a === void 0 ? void 0 : _a.textContent) || '15';
    countdownValue = parseInt(activeTime);
    if (countdownElement) {
        countdownElement.textContent = countdownValue.toString();
        countdownElement.style.opacity = '0';
    }
    hasStartedTyping = false;
    typingArea === null || typingArea === void 0 ? void 0 : typingArea.setAttribute('contenteditable', 'true');
    loadNewPrompt();
}
if (startBtn && typingArea) {
    typingArea.classList.add('unfocused');
    loadNewPrompt();
    typingArea.focus();
    typingArea.classList.remove('unfocused');
    startBtn.addEventListener('click', function () {
        resetTimer();
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
        showUIElements();
    }
    else {
        typingArea === null || typingArea === void 0 ? void 0 : typingArea.classList.add('typing-in-progress');
    }
});
document.addEventListener('mousemove', showUIElements);
document.addEventListener('click', showUIElements);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && document.activeElement === startBtn) {
        showUIElements();
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        startBtn === null || startBtn === void 0 ? void 0 : startBtn.focus();
    }
});
//# sourceMappingURL=app.js.map