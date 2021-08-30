import { calcAnimationDegree } from "../../lib/utils/utils";

test('a4 b3 c5 arccos = 36.87', () => {
    const attackerCoords = {
        left: 10,
        top: 4,
    }

    const victimCoords = {
        left: 6,
        top: 1,
    }
    
    const expected = 36.87;
    const result = +calcAnimationDegree(attackerCoords, victimCoords).toFixed(2);
    expect(result).toBe(expected);
})