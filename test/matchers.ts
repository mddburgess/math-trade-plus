import {expect} from '@jest/globals'
import {
  CharStreams,
  CommonTokenStream,
  ErrorListener,
  Lexer,
  Parser,
  ParserRuleContext,
  RecognitionException,
  Recognizer,
  Token
} from 'antlr4';

const DEFAULT_CHANNEL = 0;

export const toBeFullyParsedBy = (
  source: string,
  LexerType: typeof Lexer,
  ParserType: typeof Parser,
  rule: string
): jest.CustomMatcherResult => {

  const lexerErrorListener = new TestErrorListener<number>();
  const lexer = new LexerType(CharStreams.fromString(source));
  lexer.removeErrorListeners();
  lexer.addErrorListener(lexerErrorListener);

  const tokenStream = new CommonTokenStream(lexer);

  const parserErrorListener = new TestErrorListener<Token>();
  const parser = new ParserType(tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(parserErrorListener);

  expect(parser).toHaveProperty(rule);
  const context: ParserRuleContext = parser[rule]()

  const realTokens = tokenStream.tokens
    .filter(t => t.type !== Token.EOF)
    .filter(t => t.channel === DEFAULT_CHANNEL);
  const tokensConsumed = realTokens.indexOf(context.stop) + 1;

  return {
    pass: lexerErrorListener.error === null
      && parserErrorListener.error === null
      && tokensConsumed === realTokens.length,

    message: () => {
      if (lexerErrorListener.error !== null) {
        return `lexer: ${lexerErrorListener.error}`;
      }
      if (parserErrorListener.error !== null) {
        return `parser: ${parserErrorListener.error}`;
      }
      if (tokensConsumed < realTokens.length) {
        const unexpectedToken = realTokens[tokensConsumed];
        return `line ${unexpectedToken.line}:${unexpectedToken.column + 1} unexpected token '${unexpectedToken.text}'`;
      }
      return `Expected input not to be fully parsed, but it was.`;
    }
  };
}

class TestErrorListener<T> extends ErrorListener<T> {

  error: string = null;

  syntaxError(
    recognizer: Recognizer<T>,
    offendingSymbol: T,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | undefined
  ) {
    this.error = `line ${line}:${column + 1} ${msg}`;
  }
}
