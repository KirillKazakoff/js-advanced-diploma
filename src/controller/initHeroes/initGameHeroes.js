import Characters from "../../logic/characters";
import { generateChars } from "../../js/generators";

export default function init() {
    const charsPl = generateChars(1, 2, 'PL');
    const charsAI = generateChars(1, 2, 'AI');
    
    return new Characters(charsPl, charsAI);
}