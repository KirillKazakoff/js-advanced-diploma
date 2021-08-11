import { generateChars } from '../generators';

test('generators test', () => {
    const expected = 5;
    const result = generateChars(4, 5, 'player');

    expect(result.length).toBe(expected);
});
