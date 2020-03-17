import test from 'ava';

import { Matrix3 } from './Matrix3';

test('determinant: case 1', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const d = m.getDeterminant();

  t.is(d, 0);
});

test('determinant: case 2', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 2, 9);
  const d = m.getDeterminant();

  t.is(d, -36);
});

test('invert: determinant = 0', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9);

  const fn = (): void => {
    m.invert();
  };

  t.throws(fn);
});

test('invert: case 1', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 2, 9).invert();
  const e = new Matrix3().set(
    -11 / 12,
    1 / 3,
    1 / 12,
    -1 / 6,
    1 / 3,
    -1 / 6,
    3 / 4,
    -1 / 3,
    1 / 12,
  );

  t.deepEqual(m.elements, e.elements);
});

test('transpose', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).transpose();
  const e = new Matrix3().set(1, 4, 7, 2, 5, 8, 3, 6, 9);

  t.deepEqual(m.elements, e.elements);
});

test('minors', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).getMinors();
  const e = new Matrix3().set(-3, -6, -3, -6, -12, -6, -3, -6, -3);

  t.deepEqual(m.elements, e.elements);
});

test('cofactors', (t) => {
  const m = new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9).getCofactors();
  const e = new Matrix3().set(-3, 6, -3, 6, -12, 6, -3, 6, -3);

  t.deepEqual(m.elements, e.elements);
});
