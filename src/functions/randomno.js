export function generateRandomNumber(min = 10000000, max = 99999999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}