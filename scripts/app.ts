const typingArea: HTMLElement | null = document.querySelector('.typing-area')
const startBtn: HTMLElement | null = document.querySelector('.start-btn')

const sampleTexts: string[] = ['Sample text 1', 'Sample text 2', 'Sample text 3']
let currentPosition: number = 0
let currentPrompt: string = ''

function loadNewPrompt() {
  currentPrompt = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  typingArea!.innerHTML = currentPrompt.split('').map(char => `<span>${char}</span>`).join('')
  currentPosition = 0
  setCursorAtStart(typingArea!)
}

if (startBtn && typingArea) {
  typingArea.classList.add('unfocused')
  loadNewPrompt()
  typingArea.focus()
  typingArea.classList.remove('unfocused')

  startBtn.addEventListener('click', () => {
    loadNewPrompt()
  })

  typingArea.addEventListener('keydown', (e) => {
    e.preventDefault()

    if (e.key === 'Backspace' && currentPosition > 0) {
      currentPosition--
      resetCharacterStyle(currentPosition)
    } else if (e.key.length === 1 && currentPosition < currentPrompt.length) {
      const charTyped = e.key
      if (charTyped === currentPrompt[currentPosition]) {
        applyCharacterStyle('correct')
      } else {
        applyCharacterStyle('incorrect')
      }
      currentPosition++
    }

    setCursorAfterStyledChar(typingArea, currentPosition)
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

function applyCharacterStyle(className: string) {
  if (typingArea) {
    const targetNode = typingArea.childNodes[currentPosition] as HTMLElement
    if (targetNode) {
      targetNode.className = className
      setCursorAfterStyledChar(typingArea, currentPosition + 1)
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
  const range = document.createRange()
  const sel = window.getSelection()

  const styledSpan = element.querySelectorAll('span')[position - 1]

  if (styledSpan) {
    range.setStartAfter(styledSpan)
  } else {
    range.setStart(element.childNodes[0], position)
  }

  range.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(range)
}


const timeSelections: NodeListOf<HTMLElement> = document.querySelectorAll('.time-selection')

timeSelections.forEach(timeSelection => {
  timeSelection.addEventListener('click', (e) => {
    e.preventDefault()
    
    timeSelections.forEach(element => element.classList.remove('active'))
    timeSelection.classList.add('active')
  })
})