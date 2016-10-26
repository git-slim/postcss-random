import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.notDeepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('returns value', t => {
    return run(t, 'a{width: random()px}', 'a{ width: }', { });
});
