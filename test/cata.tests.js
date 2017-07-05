
// @flow

declare var describe: Function;
declare var it: Function;

import { cata } from "../src/schemes";

import type { ExprF, Expr } from "./example-data/expression-ast";

import { assert } from "chai";

import {
  Plus, Times, Paren, Num, exprFunctor,
  prj, times, paren, num, plus
} from "./example-data/expression-ast";

describe('catamorphism', () => {

  it('should let you fold a tree', () => {

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

    assert.strictEqual(evalExpr(expr), 48);
  });
});

