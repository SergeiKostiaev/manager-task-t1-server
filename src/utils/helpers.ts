export const generateId = (): number => {
    return Math.floor(Math.random() * 1000000);
};

export const validateTaskData = (taskData: any): boolean => {
    return !!taskData.title &&
        typeof taskData.title === 'string' &&
        (!taskData.description || typeof taskData.description === 'string');
};