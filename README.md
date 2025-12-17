# DiVA Client End-to-end tests

End-to-end tests for [diva-client](https://github.com/lsu-ub-uu/diva-client), implemented using Playwright.

## Running tests

### Environment variables

The following environment variables are required to run the tests. Either pass them command line, or create a .env file (for running locally).

TARGET_URL: The DiVA Client URL on which the tests should be run. E.g https://cora.epc.ub.uu.se/divaclient
CORA_API_URL: The URL to the Cora REST API where test data will be created. E.g. https://cora.epc.ub.uu.se/diva/rest
