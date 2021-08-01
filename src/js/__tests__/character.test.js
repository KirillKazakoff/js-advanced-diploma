import Character from '../classes/main';

test('can\'t invoke parent class', () => {
    const check = () => new Character();
    expect(check).toThrow();
});
