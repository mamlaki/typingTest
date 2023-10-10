export async function getRandomWords(count = 10, maxLength = 8): Promise<string[]> {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count * 2}`)
    const words = await response.json()
    const filteredWords = words.filter((word: string) => word.length <= maxLength)
    return filteredWords.slice(0, count)
  } catch (error) {
    console.error("Error fetching random words: ", error)
    return []
  }
}