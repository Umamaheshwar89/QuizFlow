export const calculateLevel = (xp: number): number => {
    if (xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateNextLevelXP = (currentLevel: number): number => {
    return 100 * Math.pow(currentLevel, 2);
};

export const calculateLevelProgress = (xp: number): number => {
    const currentLevel = calculateLevel(xp);
    const currentLevelBaseXP = 100 * Math.pow(currentLevel - 1, 2);
    const nextLevelXP = calculateNextLevelXP(currentLevel);

    const xpInCurrentLevel = xp - currentLevelBaseXP;
    const xpNeededForLevel = nextLevelXP - currentLevelBaseXP;

    if (xpNeededForLevel === 0) return 0;

    return Math.min(Math.max(xpInCurrentLevel / xpNeededForLevel, 0), 1);
};
