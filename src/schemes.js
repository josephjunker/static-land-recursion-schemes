
// @flow

import type { HKT } from "flow-static-land/lib/HKT";
import type { Functor } from "flow-static-land/lib/Functor";
import type { Either } from "flow-static-land/lib/Either";

import { either } from "flow-static-land/lib/Either";

import type { Fix } from "./Fix";
import { In, out } from "./Fix";

export type Algebra<F, A> = HKT<F, A> => A;

export function cata<F, A>(transformer: Algebra<F, A>,
                           term: Fix<F>,
                           functor: Functor<F>) : A {
  const extracted = out(term),
        childrenMapped = functor.map(x => cata(transformer, x, functor), extracted),
        transformed = transformer(childrenMapped);

  return transformed;
}
export const catamorphism = cata;

export type Coalgebra<F, A> = A => HKT<F, A>;

export function ana<F, A>(transformer: Coalgebra<F, A>,
                          seed: A,
                          functor: Functor<F>) : Fix<F> {
  const transformed = transformer(seed),
        childrenMapped = functor.map(x => ana(transformer, x, functor), transformed),
        rewrapped = new In(childrenMapped);

  return rewrapped;
}
export const anamorphism = ana;

export type RAlgebra<F, A> = (Fix<F>, HKT<F, A>) => A;
export function para<F, A>(transformer: RAlgebra<F, A>,
                           term: Fix<F>,
                           functor: Functor<F>) : A {
  const extracted = out(term),
        childrenMapped = functor.map(x => para(transformer, x, functor), extracted),
        transformed = transformer(term, childrenMapped);

  return transformed;
}

function id<A>(a: A) : A {
  return a;
}

export type RCoalgebra<F, A> = A => HKT<F, Either<Fix<F>, A>>;
export function apo<F, A>(transformer: RCoalgebra<F, A>,
                          seed: A,
                          functor: Functor<F>) : Fix<F> {

  const transformed : HKT<F, Either<Fix<F>, A>> = transformer(seed);

  function fanIn(e: Either<Fix<F>, A>) : Fix<F> {
    return either(id, x => apo(transformer, x, functor), e);
  }

  const childrenMapped : HKT<F, Fix<F>> = functor.map(fanIn, transformed);
  return new In(childrenMapped);
}
export const apomorphism = apo;

export function hylo<F, A, B>(tearDown: Algebra<F, B>,
                              buildUp: Coalgebra<F, A>,
                              seed: A,
                              functor: Functor<F>) : B {
  const built : HKT<F, A> = buildUp(seed),
        recursed : HKT<F, B> = functor.map((x : A) => hylo(tearDown, buildUp, x, functor), built),
        flattened : B = tearDown(recursed);

  return flattened;
}
export const hylomorphism = hylo;

function zygoAlgebra<F, A, B>(alg: Algebra<F, B>,
                              almostAlgebra: (HKT<F, [A, B]>) => A,
                              functor: Functor<F>) : Algebra<F, [A, B]> {
  return function(wrappedPair: HKT<F, [A, B]>) : [A, B] {
    const secondWrapped : HKT<F, B> = functor.map(pair => pair[1], wrappedPair),
          secondReduced : B = alg(secondWrapped),
          firstReduced : A = almostAlgebra(wrappedPair);

    return [firstReduced, secondReduced];
  };
}

export function zygo<F, A, B>(tearDown: Algebra<F, B>,
                              coalesce: (HKT<F, [A, B]>) => A,
                              term: Fix<F>,
                              functor: Functor<F>) : A {
  return cata(zygoAlgebra(tearDown, coalesce, functor), term, functor)[0];
};
export const zygomorphism = zygo;

export function gApo<F, A, B>(expand: Coalgebra<F, B>,
                              expandA: A => HKT<F, Either<A, B>>,
                              seed: A,
                              functor: Functor<F>) : Fix<F> {

  const expanded : HKT<F, Either<A, B>> = expandA(seed);

  function fanIn(e: Either<A, B>) : Fix<F> {
    return either(a => gApo(expand, expandA, a, functor), b => ana(expand, b, functor), e);
  }

  const transformed : HKT<F, Fix<F>> = functor.map(fanIn, expanded);
  return new In(transformed);
};

export type NaturalTransformation<F, A> = (HKT<F, A>) => HKT<F, A>;

export function prepro<F, A>(naturalTransformer: NaturalTransformation<F, A>,
                             transformer: Algebra<F, A>,
                             term: Fix<F>,
                             functor: Functor<F>) : A {
  const extracted : HKT<F, Fix<F>> = out(term),
        childrenMapped : HKT<F, A> = functor.map(
                               x => prepro(naturalTransformer, transformer, x, functor),
                               extracted),
        childrenMappedTransformed = naturalTransformer(childrenMapped),
        transformed : A = transformer(childrenMappedTransformed);

  return transformed;
}
export const prepromorphism = prepro;

export function postPro<F, A>(naturalTransformer: NaturalTransformation<F, A>,
                              expand: Coalgebra<F, A>,
                              seed: A,
                              functor: Functor<F>) : Fix<F> {
  const expanded : HKT<F, A> = expand(seed),
        naturalTransformed : HKT<F, A> = naturalTransformer(expanded),
        childrenMapped = functor.map(
          x => postPro(naturalTransformer, expand, x, functor),
          naturalTransformed),
        rewrapped = new In(childrenMapped);

  return rewrapped;
}
export const postpromorphism = postPro;


