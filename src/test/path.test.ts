import assert from 'assert';

import { matchPath, parsePath } from '../main/index.js';

describe('parsePath', () => {

    it('parses /', () => {
        const tokens = parsePath('/');
        assert.deepStrictEqual(tokens, []);
    });

    it('parses /hello/world', () => {
        const tokens = parsePath('/hello/world');
        assert.deepStrictEqual(tokens, [
            { type: 'string', value: '/hello/world' }
        ]);
    });

    it('parses /foo/{fooId}', () => {
        const tokens = parsePath('/foo/{fooId}');
        assert.deepStrictEqual(tokens, [
            { type: 'string', value: '/foo/' },
            { type: 'param', value: 'fooId', wildcard: false },
        ]);
    });

    it('parses /foo/{fooId}/bar/{barId}', () => {
        const tokens = parsePath('/foo/{fooId}/bar/{barId}');
        assert.deepStrictEqual(tokens, [
            { type: 'string', value: '/foo/' },
            { type: 'param', value: 'fooId', wildcard: false },
            { type: 'string', value: '/bar/' },
            { type: 'param', value: 'barId', wildcard: false },
        ]);
    });

    it('parses /foo/{fooId}/bar/{barId}.{ext}', () => {
        const tokens = parsePath('/foo/{fooId}/bar/{barId}.{ext}');
        assert.deepStrictEqual(tokens, [
            { type: 'string', value: '/foo/' },
            { type: 'param', value: 'fooId', wildcard: false },
            { type: 'string', value: '/bar/' },
            { type: 'param', value: 'barId', wildcard: false },
            { type: 'string', value: '.' },
            { type: 'param', value: 'ext', wildcard: false },
        ]);
    });

});

describe('matchPath', () => {

    describe('/', () => {
        const route = '/';

        it('match whole', () => {
            const m = matchPath(route, '/');
            assert.deepStrictEqual(m, {});
        });

        it('match without trailing slash', () => {
            const m = matchPath(route, '');
            assert.deepStrictEqual(m, {});
        });

        it('match start', () => {
            const m = matchPath(route, '/hello/world', true);
            assert.deepStrictEqual(m, {});
        });

        it('no match', () => {
            const m1 = matchPath(route, '/hello/world');
            assert.deepStrictEqual(m1, null);
        });
    });

    describe('/hello/world', () => {
        const route = '/hello/world';

        it('match whole', () => {
            const m = matchPath(route, '/hello/world');
            assert.deepStrictEqual(m, {});
        });

        it('match start', () => {
            const m = matchPath(route, '/hello/world/blah', true);
            assert.deepStrictEqual(m, {});
        });

        it('no match', () => {
            const m1 = matchPath(route, '/hello/wrld');
            assert.deepStrictEqual(m1, null);
            const m2 = matchPath(route, '/hello/world/123');
            assert.deepStrictEqual(m2, null);
        });

        it('match trailing "/"', () => {
            const m = matchPath(route, '/hello/world/');
            assert.deepStrictEqual(m, {});
        });
    });

    describe('/hello/world/', () => {
        const route = '/hello/world/';

        it('match whole', () => {
            const m = matchPath(route, '/hello/world/');
            assert.deepStrictEqual(m, {});
        });

        it('match start', () => {
            const m = matchPath(route, '/hello/world/blah', true);
            assert.deepStrictEqual(m, {});
        });

        it('no match', () => {
            const m1 = matchPath(route, '/hello/wrld');
            assert.deepStrictEqual(m1, null);
            const m2 = matchPath(route, '/hello/world/123');
            assert.deepStrictEqual(m2, null);
        });

        it('match without trailing slash', () => {
            const m = matchPath(route, '/hello/world');
            assert.deepStrictEqual(m, {});
        });
    });


    describe('/foo/{fooId}/bar/{barId}', () => {
        const route = '/foo/{fooId}/bar/{barId}';

        it('match whole', () => {
            const m = matchPath(route, '/foo/123/bar/345');
            assert.deepStrictEqual(m, { fooId: '123', barId: '345' });
        });

        it('match start', () => {
            const m = matchPath(route, '/foo/123/bar/345/baz', true);
            assert.deepStrictEqual(m, { fooId: '123', barId: '345' });
        });

        it('match special characters', () => {
            const m = matchPath(route, '/foo/123:456/bar/345:789/baz', true);
            assert.deepStrictEqual(m, { fooId: '123:456', barId: '345:789' });
        });

        it('no match', () => {
            const m = matchPath(route, '/foo/123/bar/345/baz');
            assert.deepStrictEqual(m, null);
        });
    });

    describe('/{filename}.{ext}', () => {
        const route = '/{filename}.{ext}';

        it('match whole', () => {
            const m = matchPath(route, '/document.pdf');
            assert.deepStrictEqual(m, { filename: 'document', ext: 'pdf' });
        });

        it('match start', () => {
            const m = matchPath(route, '/document.pdf/123', true);
            assert.deepStrictEqual(m, { filename: 'document', ext: 'pdf' });
        });

        it('no match', () => {
            const m1 = matchPath(route, '/document.pdf/123');
            assert.deepStrictEqual(m1, null);
        });
    });

    describe('/tags/{*tags}', () => {
        const route = '/tags/{*tags}';

        it('match all path components', () => {
            const m = matchPath(route, '/tags/1/2/3');
            assert.deepStrictEqual(m, { tags: '1/2/3' });
        });
    });

});
