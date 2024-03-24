grammar Wants;

username : LPAREN UserName RPAREN ;

UserName : CHAR* (ALPHA | '_') CHAR* ;

LPAREN : '(' ;
RPAREN : ')' ;

WS : [\n\r\t ]+ -> skip ;

fragment CHAR  : ALPHA | DIGIT | '_' ;
fragment ALPHA : [A-Za-z] ;
fragment DIGIT : [0-9] ;
