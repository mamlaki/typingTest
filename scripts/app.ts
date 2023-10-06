const typingArea: HTMLTextAreaElement | null = document.querySelector('.user-input') as HTMLTextAreaElement
const startBtn: HTMLElement | null = document.querySelector('.start-btn')

const sampleTexts: string[] = ['Sample text 1', 'Sample text 2', 'Sample text 3']

let isStarting = true

if (startBtn && typingArea) {
  startBtn.addEventListener('click', () => {
    const randomText: string = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    typingArea.value = randomText

    isStarting = true
  })

  typingArea.addEventListener('keydown', (e) => {
    if (isStarting) {
      typingArea.value = '';
      isStarting = false
    }
  })
}