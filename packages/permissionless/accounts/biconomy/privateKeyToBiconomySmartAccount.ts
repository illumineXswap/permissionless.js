import { type Chain, type Client, type Hex, type Transport } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import type { EntryPoint, Prettify } from "../../types"
import {
    type BiconomySmartAccount,
    type SignerToBiconomySmartAccountParameters,
    signerToBiconomySmartAccount
} from "./signerToBiconomySmartAccount"

export type PrivateKeyToBiconomySmartAccountParameters<
    entryPoint extends EntryPoint
> = Prettify<
    {
        privateKey: Hex
    } & Omit<SignerToBiconomySmartAccountParameters<entryPoint>, "signer">
>

/**
 * @description Creates a Biconomy Smart Account from a private key.
 *
 * @returns A Private Key Biconomy Smart Account using ECDSA as default validation module.
 */
export async function privateKeyToBiconomySmartAccount<
    entryPoint extends EntryPoint,
    TTransport extends Transport = Transport,
    TChain extends Chain | undefined = Chain | undefined
>(
    client: Client<TTransport, TChain, undefined>,
    {
        privateKey,
        ...rest
    }: PrivateKeyToBiconomySmartAccountParameters<entryPoint>
): Promise<BiconomySmartAccount<entryPoint, TTransport, TChain>> {
    const privateKeyAccount = privateKeyToAccount(privateKey)
    return signerToBiconomySmartAccount<
        entryPoint,
        TTransport,
        TChain,
        "privateKey"
    >(client, {
        signer: privateKeyAccount,
        ...rest
    })
}
