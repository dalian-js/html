import assert from 'assert';
import { describe, test } from 'node:test';
import Html from '../index';

describe('Util', () => {
  test('Undefined contents', async () => {
    assert.equal(
      await Html.contentsToString([
        undefined,
        Promise.resolve(undefined),
        [undefined, Promise.resolve(undefined)],
        null,
        Promise.resolve(null),
        [null, Promise.resolve(null)],
        [[[[[[[]]]]]]]
      ]),
      ''
    );

    for (const i of [
      undefined,
      Promise.resolve(undefined),
      [undefined, Promise.resolve(undefined)],
      null,
      Promise.resolve(null),
      [null, Promise.resolve(null)],
      [[[[[[[]]]]]]]
    ]) {
      assert.equal(await Html.contentToString(i), '');
    }

    assert.equal(await Html.contentsToString([]), '');
  });

  test('Deep scaping', async () => {
    assert.equal(
      await Html.contentsToString(['<>', Promise.resolve('<>')], true),
      '&lt;>&lt;>'
    );

    assert.equal(
      await Html.contentsToString(
        [
          undefined,
          Promise.resolve(undefined),
          [undefined, Promise.resolve(undefined)],
          null,
          Promise.resolve(null),
          [null, Promise.resolve(null)],
          [[[[[[['<>']]]]]]]
        ],
        true
      ),
      '&lt;>'
    );
  });

  test('String contents', async () => {
    assert.equal(
      await Html.contentsToString([
        'a',
        Promise.resolve('b'),
        ['c', Promise.resolve('d')]
      ]),
      'abcd'
    );
  });

  test('Only string contents', async () => {
    assert.equal(await Html.contentsToString(['a', 'b', ['c', 'd']]), 'abcd');
  });

  test('Promises', async () => {
    const result = Html.contentsToString([
      Promise.resolve('a'),
      Promise.resolve('b'),
      Promise.resolve(['c', Promise.resolve('d')])
    ]);

    assert.ok(result instanceof Promise);
    assert.equal(await result, 'abcd');
  });

  test('h() function', async () => {
    assert.equal(Html.h, Html.createElement);
  });

  test('esm and cjs usage', async () => {
    const Html0 = require('../index');
    const Html1 = await import('../index');

    assert.deepStrictEqual(Html0, Html);
    assert.deepStrictEqual(Html1, Html);
  });
});
