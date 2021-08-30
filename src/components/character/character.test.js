import Character from './character';

jest.mock('../../js/gamePlay', () => ({
    methodToMock: 0,
}));
jest.mock('../../js/gameState', () => ({
    methodToMock2: 0,
}));
// import { methodToMock } from '../gamePlay'
// import { methodToMock2 } from '../gameState';

test('can\'t invoke parent class', () => {
    // methodToMock.mockImplementation(() => 0);
    // methodToMock2.mockImplementation(() => 0);
    const check = () => new Character();
    expect(check).toThrow();
});

