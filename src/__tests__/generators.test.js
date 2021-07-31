import generateTeam from '../js/generators';

test('generators test', () => {
    const expected = 5;
    const result = generateTeam(4, 5, 'player');

    expect(result.length).toBe(expected);
});
