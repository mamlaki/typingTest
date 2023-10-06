const typingArea: HTMLElement | null = document.querySelector('.typing-area')
const startBtn: HTMLElement | null = document.querySelector('.start-btn')

const sampleTexts: string[] = ['Sample text 1', 'Sample text 2', 'Sample text 3']
let currentPosition: number = 0
let currentPrompt: string = ''

if (startBtn && typingArea) {
  startBtn.addEventListener('click', () => {
    currentPrompt = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    typingArea.textContent = currentPrompt
    currentPosition = 0
    setCursorAtStart(typingArea)
  })

  typingArea.addEventListener('input', (e) => {
    const plainText = typingArea.textContent ? typingArea.textContent.replace(/<[^>]*>/g, "") : ""
    
    if (plainText[currentPosition] === currentPrompt[currentPosition]) {
      applyCharacterStyle('correct')
    } else {
      applyCharacterStyle('incorrect')
    }

    currentPosition++
  })
}

function applyCharacterStyle(className: string) {
  if (typingArea) {
    const charToStyle = currentPrompt[currentPosition]
    const preText = currentPrompt.substring(0, currentPosition)
    const postText = currentPrompt.substring(currentPosition + 1)
    const styledChar = `<span class="${className}">${charToStyle}</span>`
  
    typingArea.innerHTML = preText + styledChar + postText
    setCursorAfterStyledChar(typingArea, currentPosition)
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

  const styledSpan = element.querySelectorAll('span')[0]

  if (styledSpan) {
    range.setStartAfter(styledSpan)
    range.collapse(true)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }
}