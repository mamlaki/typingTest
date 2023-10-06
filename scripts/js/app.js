"use strict";
var promptElement = document.querySelector('.prompt');
var startBtn = document.querySelector('.start-btn');
var sampleTexts = ['Sample text 1', 'Sample text 2', 'Sample text 3'];
if (startBtn) {
    startBtn.addEventListener('click', function () {
        var randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        if (promptElement)
            promptElement.textContent = randomText;
    });
}
//# sourceMappingURL=app.js.map