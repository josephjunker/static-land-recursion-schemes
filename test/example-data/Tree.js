
// @flow

import type { Functor } from "flow-static-land/lib/Functor";
import type { HKT, HKT2 } from "flow-static-land/lib/HKT";
import type { Fix } from "./Fix";
import { In } from "./Fix";

export class IsTree {};

export type TreeF = HKT<IsTree, *>;

export type Tree<A, B> = HKT2<IsTree, A, B>;

export type TreeI<A, B>
  = TreeNode<A, B>
  | TreeLeaf<B>;

export class TreeNode<A, B> {
  left: HKT<A, B>;
  right: HKT<A, B>;
  constructor(left: HKT<A, B>, right: HKT<A, B>) {
    this.left = left;
    this.right = right;
  }
};

export class TreeLeaf<B> {
  value: B;
  constructor(value: B) {
    this.value = value;
  }
};

export function inj<A, B>(a: TreeI<A, B>) : Tree<A, B> {
  return ((a: any): Tree<A, B>);
};

export function prj<A, B>(a: Tree<A, B>) : TreeI<A, B> {
  return ((a: any): TreeI<A, B>);
};

export function map<A, B, C>(fn: (B) => C, a: Tree<A, B>) : Tree<A, C> {
  
  const node = prj(a);

  return inj(
    node instanceof TreeNode ? new TreeNode(map(fn, node.left), map(fn, node.right))
  : /* TreeLeaf             */ node)

};

if (false) {
  ({map} : Functor<TreeF>)
}

export type FixedTree = Fix<TreeF>;

export const treeFunctor = { map };

