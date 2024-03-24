import {expect} from '@jest/globals';
import {toBeFullyParsedBy} from './matchers'
import {Lexer, Parser} from 'antlr4';

expect.extend({
  toBeFullyParsedBy
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeFullyParsedBy(LexerType: typeof Lexer, ParserType: typeof Parser, rule: String): R;
    }
  }
}
