const promptElement: HTMLElement | null = document.querySelector('.prompt')
const startBtn: HTMLElement | null = document.querySelector('.start-btn')

const sampleTexts: string[] = ['Sample text 1', 'Sample text 2', 'Sample text 3']

if (startBtn) {
  startBtn.addEventListener('click', () => {
    const randomText: string = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    if (promptElement) promptElement.textContent = randomText
  })
}