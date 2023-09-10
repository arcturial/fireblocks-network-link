import Client from '../../src/client';
import config from '../../src/config';
import { ApiError, AssetDefinition, Capabilities, GeneralError } from '../../src/client/generated';
import { isFoundInAccountDetails } from './account-validation';

const KNWON_API_VERSIONS = ['0.0.1'];

describe('Capabilities', () => {
  let client: Client;

  beforeAll(() => {
    client = new Client();
  });

  describe('/capabilities', () => {
    const capabilitiesConfig: Capabilities = config.get('capabilities');
    let capabilitiesResponse: Capabilities;

    beforeAll(async () => {
      capabilitiesResponse = await client.capabilities.getCapabilities({});
    });

    it('should match config capabilities', () => {
      expect(capabilitiesResponse).toEqual(capabilitiesConfig);
    });

    it('should include a known api version', () => {
      expect(isKnownApiVersion(capabilitiesConfig.version)).toBe(true);
    });

    describe.each(Object.entries(capabilitiesConfig.components))('%s', (key, component) => {
      it.skipIf(!Array.isArray(component))(
        'should find each account in /accounts/:accountId',
        async () => {
          for (const accountId of component) {
            const found = await isFoundInAccountDetails(accountId);
            expect(found).toBe(true);
          }
        }
      );
    });
  });

  describe('/capabilities/assets', () => {
    let result: { assets: AssetDefinition[] };

    beforeAll(async () => {
      result = await client.capabilities.getAdditionalAssets({});
    });

    describe('Interaction with /capabilities/assets/:id', () => {
      const isListedAsset = async (assetId: string): Promise<boolean> => {
        try {
          const asset = await client.capabilities.getAssetDetails({ id: assetId });
          return asset?.id === assetId;
        } catch (err) {
          if (err instanceof ApiError && err.body?.errorType === GeneralError.errorType.NOT_FOUND) {
            return false;
          }
          throw err;
        }
      };

      it('should find each listed asset on asset details endpoint', async () => {
        for (const asset of result.assets) {
          const found = await isListedAsset(asset.id);
          expect(found).toBe(true);
        }
      });
    });
  });
});

function isKnownApiVersion(apiVersion: string) {
  return KNWON_API_VERSIONS.includes(apiVersion);
}
