
const bcrypt = require('bcrypt');
const saltRounds = 10;

export async function EncPass(password) {


    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error; // Re-throw the error for proper handling
    }


}

export async function DecPass(hash, plain) {
    try {
        const result = await bcrypt.compare(plain, hash); // Use await for async call
        const valid = result; // Assign the result (true/false) to valid
        // console.log(valid);
        return valid
    } catch (error) {
        console.error("Error comparing password:", error);
        throw error; // Re-throw the error for proper handling
    }
}
