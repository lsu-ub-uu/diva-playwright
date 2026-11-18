import { test } from '../util/fixtures';

test.describe('Uncovered loader branches', () => {
    test.describe('Root loader', () => {
        test.fixme('handles dependency failures with a route error response', async () => { });
        test.fixme('sets robot indexing metadata from BLOCK_ROBOT_INDEXING', async () => { });
    });

    test.describe('Resource loaders', () => {
        test.fixme('returns an empty autocomplete result when search fails', async () => { });
        test.fixme('returns the upstream error response when binary download is not successful', async () => { });
        test.fixme('returns a gateway error when binary download throws', async () => { });
        test.fixme('loads a linked record with and without a presentation link', async () => { });
        test.fixme('returns an error result when linked record loading fails', async () => { });
        test.fixme('serves translations for a requested language', async () => { });
    });
});