
// @flow

import type { HKT } from "flow-static-land/lib/HKT";

export type Fix<F> = In<F>;

export class In<F> {
  term: HKT<F, Fix<F>>;
  constructor(term: HKT<F, Fix<F>>) {
    this.term = term;
  };
};

export function out<F>(term: Fix<F>) : HKT<F, Fix<F>> {
  return term.term;
}

