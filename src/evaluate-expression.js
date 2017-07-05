
// @flow

import { cata } from "./schemes";

import type { ExprF, Expr } from "./expression-ast";
import { Plus, Times, Paren, Num, exprFunctor, prj, times, paren, num, plus } from "./expression-ast";

function _evalExpr (expression: ExprF<number>) : number {
  const ex = prj(expression);
  return (
    ex instanceof Plus  ? ex.left + ex.right 
  : ex instanceof Times ? ex.left * ex.right 
  : ex instanceof Paren ? ex.contents
  : /* ex is a Num     */ ex.value);
}

const evalExpr : Expr => number = ex => cata(_evalExpr, ex, exprFunctor);


// AST for 2 * (1 + 1) * 4 * 3
const expr = times(num(2),
                   times(paren(plus(num(1), num(1))),
                         times(num(4), num(3))))
console.log(evalExpr(expr));



