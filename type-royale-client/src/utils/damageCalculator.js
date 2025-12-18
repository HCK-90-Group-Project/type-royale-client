/**
 * Card damage configuration
 */
export const CARD_DAMAGE = {
    easy: 10,
    medium: 35,
    hard: 80,
    shield: 0,
};

/**
 * Get damage value for a card type
 * @param {string} cardType - Type of card (easy, medium, hard, shield)
 * @returns {number} - Damage value
 */
export const getDamage = (cardType) => {
    return CARD_DAMAGE[cardType] || 0;
};

/**
 * Calculate damage after shield reduction
 * @param {number} damage - Original damage
 * @param {boolean} hasShield - Whether target has active shield
 * @returns {number} - Final damage after shield
 */
export const calculateDamageWithShield = (damage, hasShield) => {
    if (hasShield) {
        return 0; // Shield blocks all damage
    }
    return damage;
};

/**
 * Apply damage to HP
 * @param {number} currentHp - Current HP
 * @param {number} damage - Damage to apply
 * @param {number} maxHp - Maximum HP
 * @returns {number} - New HP value (cannot go below 0 or above maxHp)
 */
export const applyDamage = (currentHp, damage, maxHp = 100) => {
    const newHp = currentHp - damage;
    return Math.max(0, Math.min(newHp, maxHp));
};

/**
 * Check if HP is critical (below 30%)
 * @param {number} currentHp - Current HP
 * @param {number} maxHp - Maximum HP
 * @returns {boolean} - True if HP is critical
 */
export const isCriticalHp = (currentHp, maxHp = 100) => {
    return (currentHp / maxHp) <= 0.3;
};

/**
 * Get HP bar color based on percentage
 * @param {number} currentHp - Current HP
 * @param {number} maxHp - Maximum HP
 * @returns {string} - Color class name
 */
export const getHpBarColor = (currentHp, maxHp = 100) => {
    const percentage = (currentHp / maxHp) * 100;

    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
};

/**
 * Calculate total damage dealt in a match
 * @param {Array} attackHistory - Array of attack objects
 * @returns {number} - Total damage
 */
export const calculateTotalDamage = (attackHistory) => {
    return attackHistory.reduce((total, attack) => {
        return total + (attack.damage || 0);
    }, 0);
};

/**
 * Get attack effectiveness message
 * @param {string} cardType - Type of card used
 * @param {boolean} wasBlocked - Whether attack was blocked
 * @returns {string} - Message to display
 */
export const getAttackMessage = (cardType, wasBlocked) => {
    if (wasBlocked) {
        return '🛡️ Attack blocked by shield!';
    }

    const messages = {
        easy: '⚡ Quick strike!',
        medium: '🔥 Solid hit!',
        hard: '💥 CRITICAL DAMAGE!',
    };

    return messages[cardType] || 'Attack landed!';
};

/**
 * Calculate match statistics
 * @param {Object} playerData - Player game data
 * @returns {Object} - Match statistics
 */
export const calculateMatchStats = (playerData) => {
    const { ammo, maxAmmo, attackHistory = [] } = playerData;

    const ammoUsed = maxAmmo - ammo;
    const totalDamage = calculateTotalDamage(attackHistory);
    const accuracy = ammoUsed > 0 ? (attackHistory.length / ammoUsed) * 100 : 0;

    return {
        ammoUsed,
        totalDamage,
        accuracy: Math.round(accuracy),
        attackCount: attackHistory.length,
    };
};