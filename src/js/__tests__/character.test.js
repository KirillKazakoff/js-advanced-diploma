jest.mock('../gamePlay');
jest.mock('../gameState');

import Character from '../classes/main';



beforeEach(() => {
    jest.resetAllMocks();
});

jest.mock('../gamePlay', () => ({
    methodToMock: 0,
}));
import { methodToMock } from 'the-package-to-mock'


test('can\'t invoke parent class', () => {
    methodToMock.mockImplementation(() => 0);
    const check = () => new Character();
    expect(check).toThrow();
});

