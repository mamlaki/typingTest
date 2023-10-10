import { getRandomWords } from "./getRandomWords.js"

const typingArea: HTMLElement | null = document.querySelector('.typing-area')
const startBtn: HTMLElement | null = document.querySelector('.start-btn')
const countdownElement: HTMLElement | null = document.querySelector('.countdown')

let currentPosition: number = 0
let currentPrompt: string = ''
let userInput: string[] = []

let countdownTimer: number | null = null
let countdownValue: number = 0

async function loadNewPrompt() {
  try {
    const words = await getRandomWords(50, 8)
    currentPrompt = words.join(' ')
    typingArea!.innerHTML = currentPrompt.split('').map(char => `<span>${char}</span>`).join('')
    currentPosition = 0
    setCursorAtStart(typingArea!)
    typingArea?.classList.remove('typing-in-progress')
    userInput = []
  } catch (error) {
    console.error('Error in loadNewPrompt:', error)
  }
}

function resetTimer() {
  if (countdownTimer !== null) {
    clearInterval(countdownTimer)
  }
  const activeTime = document.querySelector('.time-selection.active')?.textContent || '15'
  countdownValue = parseInt(activeTime)

  if (countdownElement) {
    countdownElement.textContent = countdownValue.toString()
    countdownElement.style.opacity = '0'
  }

  hasStartedTyping = false
  typingArea?.setAttribute('contenteditable', 'true')

  if (typingArea) {
    typingArea.removeAttribute('contenteditable')
    typingArea.style.opacity = '0'
    setTimeout(() => {
      loadNewPrompt().then(() => {
        setTimeout(() => {
          if (typingArea) {
            typingArea.style.opacity = '1'
            setTimeout(() => {
              typingArea.setAttribute('contenteditable', 'true')
              typingArea.focus()
            }, 200)
          }
        }, 5)
      })
    }, 5)
  }
}

if (startBtn && typingArea) {
  typingArea.classList.add('unfocused')
  loadNewPrompt()
  typingArea.focus()
  typingArea.classList.remove('unfocused')

  startBtn.addEventListener('click', () => {
    startBtn.blur()
    resetTimer()
  })

  const lockedPositions: number[] = []

  typingArea.addEventListener('keydown', (e) => {
    console.log(`Key Pressed: ${e.key}`);
    console.log(`Initial Current Position: ${currentPosition}`);

    e.preventDefault()

    if (e.key === 'Tab') {
      e.preventDefault()
      startBtn?.focus()
      showUIElements()
      return
    }

    const getWordStartPosition = (pos: number) => {
      let tempPos = (pos - 1 < 0) ? 0 : pos - 1
      let startPos = currentPrompt.lastIndexOf(' ', tempPos) + 1
      if (startPos < 0) startPos = 0
      return startPos
    }

    const getWordEndPosition = (pos: number) => {
      let endPos = currentPrompt.indexOf(' ', pos)
      if (endPos === -1) endPos = currentPrompt.length
      return endPos
    }

    const isWordCorrect = (start: number, end: number) => {
      return currentPrompt.substring(start, end) === userInput.slice(start, end).join('')
    }

    const hasStartedTypingCurrentWord = () => {
      const currentWordStart = getWordStartPosition(currentPosition)
      return userInput.slice(currentWordStart, currentPosition).join('').length > 0
    }

    const markUntypedAsIncorrect = (start: number, end: number) => {
      for (let i = start; i < end; i++) {
        if (typeof userInput[i] === 'undefined') {
          applyCharacterStyle('incorrect', i)
        }
      }
    }

    if (e.key === 'Backspace' && currentPosition > 0) {
      const currentWordStart = getWordStartPosition(currentPosition)
      const prevWordStart = getWordStartPosition(currentPosition - 1)

      console.log(`Current Word Start: ${currentWordStart}`);
      console.log(`Previous Word Start: ${prevWordStart}`);
      console.log(`Locked Positions: ${lockedPositions}`);
      if (currentPosition > currentWordStart || !lockedPositions.includes(prevWordStart)) {
        currentPosition--
        resetCharacterStyle(currentPosition)
      } else {
        console.log('Trying to backspace into a locked position. Operation blocked.');
        return
      }
    } else if (e.key === ' ') {
     if (!hasStartedTypingCurrentWord()) {
      console.log('Cannot skip word without typing.')
      return
     }
      
     const previousWordStart = getWordStartPosition(currentPosition)
     const previousWordEnd = currentPosition

     if (!isWordCorrect(previousWordStart, previousWordEnd)) {
      markUntypedAsIncorrect(previousWordEnd, getWordEndPosition(currentPosition))
     }

     if (isWordCorrect(previousWordStart, previousWordEnd)) {
      console.log('Locking Previous Word Start: ', previousWordStart)
      if (!lockedPositions.includes(previousWordStart)) {
        lockedPositions.push(previousWordStart)
      }
     } else if (lockedPositions.includes(previousWordStart)) {
      const index = lockedPositions.indexOf(previousWordStart)
      lockedPositions.splice(index, 1)
     }

     let nextSpacePosition = currentPrompt.indexOf(' ', currentPosition)
     if (nextSpacePosition === -1) {
      nextSpacePosition = currentPrompt.length
     }
     currentPosition = nextSpacePosition + 1
    } else if (e.key.length === 1 && currentPosition < currentPrompt.length) {
      const charTyped = e.key
      userInput[currentPosition] = charTyped

      if (charTyped === currentPrompt[currentPosition]) {
        applyCharacterStyle('correct')
      } else {
        applyCharacterStyle('incorrect')
      }
      currentPosition++
    }
    console.log(`End Current Position: ${currentPosition}`);
    setCursorAfterStyledChar(typingArea, currentPosition)

    if (!hasStartedTyping) {
      const activeTime = document.querySelector('.time-selection.active')?.textContent || '15'
      countdownValue = parseInt(activeTime)

      if (countdownElement) {
        countdownElement.textContent = countdownValue.toString()
        countdownElement.style.opacity = '1'
        countdownElement.style.transition = 'opacity 0.3s ease'
      }

      countdownTimer = setInterval(() => {
        countdownValue--
        if (countdownElement) {
          countdownElement.textContent = countdownValue.toString()
        }

        if (countdownValue <= 0) {
          if (countdownElement) {
            countdownElement.textContent = 'Done.'
          }
          if (countdownTimer !== null) {
            clearInterval(countdownTimer)
          }
          typingArea?.setAttribute('contenteditable', 'false')
        }
      }, 1000)

      hasStartedTyping = true
    }
  })

  typingArea.addEventListener('click', (e) => {
    e.preventDefault()
    setCursorAfterStyledChar(typingArea, currentPosition)
  })

  typingArea.addEventListener('focus', () => {
    typingArea?.classList.remove('unfocused')
    setCursorAfterStyledChar(typingArea, currentPosition)
  })

  typingArea.addEventListener('blur', () => {
    typingArea?.classList.add('unfocused')
  })
}

const focusMessage = document.querySelector('.focus-message')
if (focusMessage) {
  focusMessage.addEventListener('click', () => {
    typingArea?.focus()
  })
}

function applyCharacterStyle(className: string, position: number = currentPosition) {
  if (typingArea) {
    const targetNode = typingArea.childNodes[position] as HTMLElement
    if (targetNode) {
      targetNode.className = className
      setCursorAfterStyledChar(typingArea, position + 1)
    }
  }
}

function resetCharacterStyle(position: number) {
  if (typingArea) {
    const targetNode = typingArea.childNodes[position] as HTMLElement
    if (targetNode) {
      targetNode.classList.remove('correct', 'incorrect')
      setCursorAfterStyledChar(typingArea, position)
    }
  }
}

function setCursorAtStart(element: HTMLElement) {
  const range = document.createRange()
  const sel = window.getSelection()
  range.setStart(element, 0)
  range.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(range)
  element.focus()
}

function setCursorAfterStyledChar(element: HTMLElement, position: number) {
  const styledSpans = element.querySelectorAll('span')
  const targetSpan = styledSpans[position - 1]

  if (targetSpan) {
    const spanRect = targetSpan.getBoundingClientRect()
    const containerRect = element.getBoundingClientRect()

    const leftDistance = spanRect.left - containerRect.left + spanRect.width
    const topDistance = spanRect.top - containerRect.top

    element.style.setProperty('--cursor-translate-x', `${leftDistance}px`)
    element.style.setProperty('--cursor-translate-y', `${topDistance}px`)
  } else {
    element.style.removeProperty('--cursor-translate-x')
    element.style.removeProperty('--cursor-translate-y')
  }
}


const timeSelections: NodeListOf<HTMLElement> = document.querySelectorAll('.time-selection')

timeSelections.forEach(timeSelection => {
  timeSelection.addEventListener('click', (e) => {
    e.preventDefault()

    timeSelections.forEach(element => element.classList.remove('active'))
    timeSelection.classList.add('active')
  })
})


let hasStartedTyping = false

function hideUIElements() {
  const footer = document.querySelector('footer')
  const toolbar = document.querySelector('.toolbar')

  if (footer) footer.classList.add('hidden')
  if (toolbar) toolbar.classList.add('hidden')
}

function showUIElements() {
  const footer = document.querySelector('footer')
  const toolbar = document.querySelector('.toolbar')

  if (footer) footer.classList.remove('hidden')
  if (toolbar) toolbar.classList.remove('hidden')
}

typingArea?.addEventListener('keydown', (e) => {
  const isFooterVisible = document.querySelector('footer:not(.hidden)')
  const isToolbarVisible = document.querySelector('.toolbar:not(.hidden)')

  if (!hasStartedTyping || (hasStartedTyping && (isFooterVisible || isToolbarVisible))) {
    hideUIElements()
    hasStartedTyping = true
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    startBtn?.focus()
    showUIElements()
  } else {
    typingArea?.classList.add('typing-in-progress')  
  }
})

document.addEventListener('mousemove', showUIElements)

document.addEventListener('click', showUIElements)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement === startBtn) {
    showUIElements()
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    startBtn?.focus()
  }
})