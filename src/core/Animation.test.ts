import test from 'ava';

import { Animation } from './Animation';

const TIME_DELTA_60 = 1 / 60;

class Mock {}

test('default', (t) => {
  const frames = [new Mock(), new Mock(), new Mock()];
  const animation = new Animation(frames);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 2);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[2]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 2);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[2]);
});

test('infinite loop', (t) => {
  const frames = [new Mock(), new Mock()];
  const animation = new Animation(frames, { loop: true });

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);
});

test('finite loop', (t) => {
  const frames = [new Mock(), new Mock()];
  const animation = new Animation(frames, { loop: 2 });

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);
});

test('delay', (t) => {
  const frames = [new Mock(), new Mock()];
  const animation = new Animation(frames, { delay: 2 * TIME_DELTA_60 });

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);
});

test('infinite loop delay', (t) => {
  const frames = [new Mock(), new Mock()];
  const animation = new Animation(frames, { delay: TIME_DELTA_60, loop: true });

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);
});

test('finite loop delay', (t) => {
  const frames = [new Mock(), new Mock()];
  const animation = new Animation(frames, { delay: TIME_DELTA_60, loop: 2 });

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 0);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[0]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), false);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);

  animation.update(TIME_DELTA_60);
  t.is(animation.getCurrentFrameIndex(), 1);
  t.is(animation.isComplete(), true);
  t.deepEqual(animation.getCurrentFrame(), frames[1]);
});
