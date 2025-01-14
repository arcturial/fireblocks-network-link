/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AssetReference } from './AssetReference';
import type { IbanCapability } from './IbanCapability';
import type { PublicBlockchainCapability } from './PublicBlockchainCapability';
import type { SwiftCapability } from './SwiftCapability';

/**
 * Capability to deposit to a balance asset using a specific transfer capability.
 */
export type DepositCapability = {
    id: string;
    deposit: (PublicBlockchainCapability | IbanCapability | SwiftCapability);
    balanceAsset: AssetReference;
};

