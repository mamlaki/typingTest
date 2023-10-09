export async function getRandomWords(count = 10, maxLength = 8): Promise<string[]> {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}&length=${maxLength}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching random words: ", error)
    return []
  }
}