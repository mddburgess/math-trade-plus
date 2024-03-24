import WantsLexer from './WantsLexer';
import WantsParser from './WantsParser';

describe('WantsParser', () => {

  it.each([
    '(alice)',
    '(Alice_123)',
    '(09alice)'
  ])('parses "%s" as a username', input => {
    expect(input).toBeFullyParsedBy(WantsLexer, WantsParser, 'username');
  });
});
