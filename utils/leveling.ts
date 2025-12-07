/**
 * Calculates the user's level based on their total XP.
 * Formula: Level = floor(sqrt(XP / 100)) + 1
 * 
 * Examples:
 * 0 XP -> Level 1
 * 100 XP -> Level 2
 * 400 XP -> Level 3
 * 900 XP -> Level 4
 */
export const calculateLevel = (xp: number): number => {
    if (xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

/**
 * Calculates the total XP required to reach the NEXT level.
 * Formula derived from: Level = sqrt(XP/100) + 1
 */
export const calculateNextLevelXP = (currentLevel: number): number => {
    // To reach Level L+1, you need XP for that level.
    // Inverse formula: XP = 100 * (Level - 1)^2
    // So for next level (CL + 1):
    // XP = 100 * ((CL + 1) - 1)^2 = 100 * CL^2
    return 100 * Math.pow(currentLevel, 2);
};

/**
 * Calculates the progress (0-1) towards the next level.
 * Useful for progress bars.
 */
export const calculateLevelProgress = (xp: number): number => {
    const currentLevel = calculateLevel(xp);
    const currentLevelBaseXP = 100 * Math.pow(currentLevel - 1, 2);
    const nextLevelXP = calculateNextLevelXP(currentLevel);

    const xpInCurrentLevel = xp - currentLevelBaseXP;
    const xpNeededForLevel = nextLevelXP - currentLevelBaseXP;

    if (xpNeededForLevel === 0) return 0; // Should not happen for levels >= 1

    return Math.min(Math.max(xpInCurrentLevel / xpNeededForLevel, 0), 1);
};
