import type { Account, Address } from "viem"
import { deepHexlify, transactionReceiptStatus } from "./deepHexlify"
import { getAddressFromInitCodeOrPaymasterAndData } from "./getAddressFromInitCodeOrPaymasterAndData"
import {
    type GetRequiredPrefundReturnType,
    getRequiredPrefund
} from "./getRequiredPrefund"
import {
    type GetUserOperationHashParams,
    getUserOperationHash
} from "./getUserOperationHash"
import { isSmartAccountDeployed } from "./isSmartAccountDeployed"
import { providerToSmartAccountSigner } from "./providerToSmartAccountSigner"
import {
    AccountOrClientNotFoundError,
    type SignUserOperationHashWithECDSAParams,
    signUserOperationHashWithECDSA
} from "./signUserOperationHashWithECDSA"
import { walletClientToSmartAccountSigner } from "./walletClientToSmartAccountSigner"

export function parseAccount(account: Address | Account): Account {
    if (typeof account === "string")
        return { address: account, type: "json-rpc" }
    return account
}

export { getBundlerError } from "./errors/getBundlerError"
export type {
    GetBundlerErrorParameters,
    GetBundlerErrorReturnType
} from "./errors/getBundlerError"

export {
    transactionReceiptStatus,
    deepHexlify,
    getUserOperationHash,
    getRequiredPrefund,
    walletClientToSmartAccountSigner,
    type GetRequiredPrefundReturnType,
    type GetUserOperationHashParams,
    signUserOperationHashWithECDSA,
    type SignUserOperationHashWithECDSAParams,
    AccountOrClientNotFoundError,
    isSmartAccountDeployed,
    providerToSmartAccountSigner,
    getAddressFromInitCodeOrPaymasterAndData
}
