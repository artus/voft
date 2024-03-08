import * as voft from '../index';

describe('index', () => {
  it('Should export all objects', () => {
    expect(voft).toHaveProperty('Try');
    expect(voft).toHaveProperty('AsyncTry');
    expect(voft).toHaveProperty('Either');
    expect(voft).toHaveProperty('Optional');
    expect(voft).toHaveProperty('HttpError');
    expect(voft).toHaveProperty('HTTP_CODES');
  });
});
