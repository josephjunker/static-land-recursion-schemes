
// @flow

import type { Functor } from "flow-static-land/lib/Functor";
import type { HKT } from "flow-static-land/lib/HKT";
import type { Fix } from "./fix";
import { In } from "./fix";

export type ExprI<A>
  = Plus<A>
  | Times<A>
  | Paren<A>
  | Num;

export class Plus<A> {
  left: A;
  right: A;
  constructor(left: A, right: A) {
    this.left = left;
    this.right = right;
  }
};

export class Times<A> {
  left: A;
  right: A;
  constructor(left: A, right: A) {
    this.left = left;
    this.right = right;
  }
};

export class Paren<A> {
  contents: A;
  constructor(contents: A) {
    this.contents = contents;
  }
};

export class Num {
  value: number;
  constructor(value: number) {
    this.value = value;
  }
};

export class IsExpr {};
export type ExprF<A> = HKT<IsExpr, A>;

export function inj<A>(a: ExprI<A>) : ExprF<A> {
  return ((a: any): ExprF<A>);
};

export function prj<A>(a: ExprF<A>) : ExprI<A> {
  return ((a: any): ExprI<A>);
};

export function map<A, B>(fn: (A) => B, a: ExprF<A>) : ExprF<B> {
  
  const node = prj(a);

  const mapped = (
    node instanceof Plus  ? new Plus(fn(node.left), fn(node.right))
  : node instanceof Times ? new Times(fn(node.left), fn(node.right))
  : node instanceof Paren ? new Paren(fn(node.contents)) 
  : /*      Num          */ node);
  
  return inj(mapped);
};

if (false) {
  ({map} : Functor<IsExpr>)
}

export type Expr = Fix<IsExpr>;

export const exprFunctor = { map };

export function plus(left: Expr, right: Expr) : Expr {
  return new In(new Plus(left, right));
}

export function times(left: Expr, right: Expr) : Expr {
  return new In(new Times(left, right));
}

export function paren(contents: Expr) : Expr {
  return new In(new Paren(contents));
}

export function num(value: number) : Expr {
  return new In(new Num(value));
}

