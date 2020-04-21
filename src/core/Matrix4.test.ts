import test from 'ava';

import { Matrix4 } from './Matrix4';

test('multiply', (t) => {
  // prettier-ignore
  const m1 = new Matrix4().set(
    5, 7, 9, 10,
    2, 3, 3, 8,
    8, 10, 2, 3,
    3, 3, 4, 8,
  );
  // prettier-ignore
  const m2 = new Matrix4().set(
    3, 10, 12, 18,
    12, 1, 4, 9,
    9, 10, 12, 2,
    3, 12, 4, 10,
  );

  const r = m1.multiply(m2);

  // prettier-ignore
  const e = new Matrix4().set(
    210, 267, 236, 271,
    93, 149, 104, 149,
    171, 146, 172, 268,
    105, 169, 128, 169,
  );

  t.deepEqual(r.elements, e.elements);
});
