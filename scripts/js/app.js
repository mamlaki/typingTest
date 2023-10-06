"use strict";
var typingArea = document.querySelector('.user-input');
var startBtn = document.querySelector('.start-btn');
var sampleTexts = ['Sample text 1', 'Sample text 2', 'Sample text 3'];
var isStarting = true;
if (startBtn && typingArea) {
    startBtn.addEventListener('click', function () {
        var randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        typingArea.value = randomText;
        isStarting = true;
    });
    typingArea.addEventListener('keydown', function (e) {
        if (isStarting) {
            typingArea.value = '';
            isStarting = false;
        }
    });
}
//# sourceMappingURL=app.js.map