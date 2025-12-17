/**
 * Validates if the typed word matches the expected word
 * @param {string} typedWord - Word typed by player
 * @param {string} expectedWord - Correct word to match
 * @returns {boolean} - True if match, false otherwise
 */
export const validateWord = (typedWord, expectedWord) => {
    return typedWord.toLowerCase().trim() === expectedWord.toLowerCase().trim();
};

/**
 * Calculate typing accuracy percentage
 * @param {string} typedWord - Word typed by player
 * @param {string} expectedWord - Correct word
 * @returns {number} - Accuracy percentage (0-100)
 */
export const calculateAccuracy = (typedWord, expectedWord) => {
    if (!typedWord || !expectedWord) return 0;

    const typed = typedWord.toLowerCase();
    const expected = expectedWord.toLowerCase();

    let matches = 0;
    const minLength = Math.min(typed.length, expected.length);

    for (let i = 0; i < minLength; i++) {
        if (typed[i] === expected[i]) matches++;
    }

    return Math.round((matches / expected.length) * 100);
};

/**
 * Get word difficulty based on length
 * @param {string} word - Word to check
 * @returns {string} - 'easy', 'medium', or 'hard'
 */
export const getWordDifficulty = (word) => {
    const length = word.length;

    if (length <= 4) return 'easy';
    if (length <= 7) return 'medium';
    return 'hard';
};

/**
 * Calculate typing speed in WPM (Words Per Minute)
 * @param {number} characterCount - Number of characters typed
 * @param {number} timeInSeconds - Time taken in seconds
 * @returns {number} - WPM
 */
export const calculateWPM = (characterCount, timeInSeconds) => {
    if (timeInSeconds === 0) return 0;

    const words = characterCount / 5; // Standard: 5 chars = 1 word
    const minutes = timeInSeconds / 60;

    return Math.round(words / minutes);
};

/**
 * Validate card type selection
 * @param {string} cardType - Selected card type
 * @param {number} ammo - Current ammo count
 * @returns {Object} - { valid: boolean, message: string }
 */
export const validateCardSelection = (cardType, ammo) => {
    const validTypes = ['easy', 'medium', 'hard', 'shield'];

    if (!validTypes.includes(cardType)) {
        return { valid: false, message: 'Invalid card type!' };
    }

    if (ammo <= 0) {
        return { valid: false, message: 'Out of ammo!' };
    }

    return { valid: true, message: 'Card selected!' };
};

/**
 * Get random word from word pool
 * @param {Array} wordPool - Array of words
 * @returns {string} - Random word
 */
export const getRandomWord = (wordPool) => {
    if (!wordPool || wordPool.length === 0) return '';
    return wordPool[Math.floor(Math.random() * wordPool.length)];
};