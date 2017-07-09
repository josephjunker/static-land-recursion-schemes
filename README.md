static-land-recursion-schemes
==================

Recursion schemes library, compatible with flow-static-land.

## Installation
```
npm install static-land-recursion-schemes
```

## Overview
This provides a small core set of recursion schemes. Functions for composing schemes are not provided. More documentation on usage will be added soon.

## Provided schemes

Exports from "static-land-recursion-schemes/lib/schemes":

```
type Algebra<F, A> = HKT<F, A> => A;
function cata<F, A>(Algebra<F, A>, Fix<F>, Functor<F>) : A 
const catamorphism = cata;

type Coalgebra<F, A> = A => HKT<F, A>;
function ana<F, A>(Coalgebra<F, A>, A, Functor<F>) : Fix<F>
const anamorphism = ana;

type RAlgebra<F, A> = (Fix<F>, HKT<F, A>) => A;
function para<F, A>(RAlgebra<F, A>, Fix<F>, Functor<F>) : A
const paramorphism = para;

type RCoalgebra<F, A> = A => HKT<F, Either<Fix<F>, A>>;
function apo<F, A>(RCoalgebra<F, A>, A, Functor<F>) : Fix<F>
const apomorphism = apo;

function hylo<F, A, B>(Algebra<F, B>, Coalgebra<F, A>, A, Functor<F>) : B
const hylomorphism = hylo;

function zygo<F, A, B>(Algebra<F, B>, (HKT<F, [A, B]>) => A, Fix<F>, Functor<F>) : A 
const zygomorphism = zygo;

function gApo<F, A, B>(Coalgebra<F, B>, A => HKT<F, Either<A, B>>, A, Functor<F>) : Fix<F>
const generalizedApomorphism = gApo;

type NaturalTransformation<F, A> = (HKT<F, A>) => HKT<F, A>;

function prepro<F, A>(NaturalTransformation<F, A>, Algebra<F, A>, Fix<F>, Functor<F>) : A
const prepromorphism = prepro;

function postpro<F, A>(NaturalTransformation<F, A>, Coalgebra<F, A>, A, Functor<F>) : Fix<F>
const postpromorphism = postpro;
```

Exports from "static-land-recursion-schemes/lib/Fix":

```
type Fix<F> = In<F>

class In<F> {
  term: HKT<F, Fix<F>>;
  constructor(term: HKT<F, Fix<F>>) {
    this.term = term;
  };
};

function out<F>(term: Fix<F>) : HKT<F, Fix<F>>

```

## License
MIT
