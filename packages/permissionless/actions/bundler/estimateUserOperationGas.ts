import {
    type Account,
    BaseError,
    type Chain,
    type Client,
    type Hex,
    type Transport
} from "viem"
import type { PartialBy } from "viem/types/utils"
import type { BundlerClient } from "../../clients/createBundlerClient"
import type { Prettify } from "../../types/"
import type { BundlerRpcSchema, StateOverrides } from "../../types/bundler"
import type { EntryPoint } from "../../types/entrypoint"
import type { UserOperation } from "../../types/userOperation"
import { deepHexlify } from "../../utils/deepHexlify"
import {
    type GetEstimateUserOperationGasErrorReturnType,
    getEstimateUserOperationGasError
} from "../../utils/errors/getEstimateUserOperationGasError"

export type EstimateUserOperationGasParameters<entryPoint extends EntryPoint> =
    {
        userOperation: PartialBy<
            UserOperation,
            "callGasLimit" | "preVerificationGas" | "verificationGasLimit"
        >
        entryPoint: entryPoint
    }

export type EstimateUserOperationGasReturnType = {
    preVerificationGas: bigint
    verificationGasLimit: bigint
    callGasLimit: bigint
}

export type EstimateUserOperationErrorType<entryPoint extends EntryPoint> =
    GetEstimateUserOperationGasErrorReturnType<entryPoint>

/**
 * Estimates preVerificationGas, verificationGasLimit and callGasLimit for user operation
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/estimateUserOperationGas
 *
 * @param client {@link BundlerClient} that you created using viem's createClient and extended it with bundlerActions.
 * @param args {@link EstimateUserOperationGasParameters}
 * @returns preVerificationGas, verificationGasLimit and callGasLimit as {@link EstimateUserOperationGasReturnType}
 *
 *
 * @example
 * import { createClient } from "viem"
 * import { estimateUserOperationGas } from "permissionless/actions"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http(BUNDLER_URL)
 * })
 *
 * const gasParameters = estimateUserOperationGas(bundlerClient, {
 *      serOperation: signedUserOperation,
 *      entryPoint: entryPoint
 * })
 *
 * // Return {preVerificationGas: 43492n, verificationGasLimit: 59436n, callGasLimit: 9000n}
 *
 */
export const estimateUserOperationGas = async <
    entryPoint extends EntryPoint,
    TTransport extends Transport = Transport,
    TChain extends Chain | undefined = Chain | undefined,
    TAccount extends Account | undefined = Account | undefined
>(
    client: Client<TTransport, TChain, TAccount, BundlerRpcSchema<entryPoint>>,
    args: Prettify<EstimateUserOperationGasParameters<entryPoint>>,
    stateOverrides?: StateOverrides
): Promise<EstimateUserOperationGasReturnType> => {
    const { userOperation, entryPoint } = args

    const userOperationWithBigIntAsHex = deepHexlify(userOperation)
    const stateOverridesWithBigIntAsHex = deepHexlify(stateOverrides)

    try {
        const response = await client.request({
            method: "eth_estimateUserOperationGas",
            params: stateOverrides
                ? [
                      userOperationWithBigIntAsHex,
                      entryPoint,
                      stateOverridesWithBigIntAsHex
                  ]
                : [userOperationWithBigIntAsHex, entryPoint]
        })

        const responseV06 = response as {
            preVerificationGas: Hex
            verificationGasLimit: Hex
            callGasLimit: Hex
        }

        return {
            preVerificationGas: BigInt(responseV06.preVerificationGas || 0),
            verificationGasLimit: BigInt(responseV06.verificationGasLimit || 0),
            callGasLimit: BigInt(responseV06.callGasLimit || 0)
        } as EstimateUserOperationGasReturnType
    } catch (err) {
        throw getEstimateUserOperationGasError(err as BaseError, args)
    }
}
