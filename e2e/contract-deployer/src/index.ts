import {
    http,
    type Address,
    createPublicClient,
    createTestClient,
    createWalletClient,
    parseEther
} from "viem"
import { mnemonicToAccount } from "viem/accounts"
import { sendTransaction } from "viem/actions"
import { foundry } from "viem/chains"
import {
    BICONOMY_ACCOUNT_V2_LOGIC_CREATECALL,
    BICONOMY_DEFAULT_FALLBACK_HANDLER_CREATECALL,
    BICONOMY_ECDSA_OWNERSHIP_REGISTRY_MOUDULE_CREATECALL,
    BICONOMY_FACTORY_CREATECALL,
    BICONOMY_SINGLETON_FACTORY_BYTECODE,
    ENTRY_POINT_SIMULATIONS_CREATECALL,
    ENTRY_POINT_V06_CREATECALL,
    ENTRY_POINT_V07_CREATECALL,
    KERNEL_ACCOUNT_V2_2_LOGIC,
    KERNEL_ECDSA_VALIDATOR,
    KERNEL_FACTORY_ADDRESS,
    SAFE_MULTI_SEND_CALL_ONLY_CREATECALL,
    SAFE_MULTI_SEND_CREATECALL,
    SAFE_PROXY_FACTORY_CREATECALL,
    SAFE_SINGLETON_CREATECALL,
    SAFE_SINGLETON_FACTORY_BYTECODE,
    SAFE_V06_MODULE_CREATECALL,
    SAFE_V06_MODULE_SETUP_CREATECALL,
    SAFE_V07_MODULE_CREATECALL,
    SAFE_V07_MODULE_SETUP_CREATECALL,
    SIMPLE_ACCOUNT_FACTORY_V06_CREATECALL,
    SIMPLE_ACCOUNT_FACTORY_V07_CREATECALL
} from "./constants"

const DETERMINISTIC_DEPLOYER = "0x4e59b44847b379578588920ca78fbf26c0b4956c"
const SAFE_SINGLETON_FACTORY = "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7"
const BICONOMY_SINGLETON_FACTORY = "0x988C135a1049Ce61730724afD342fb7C56CD2776"

const verifyDeployed = async (addresses: Address[]) => {
    for (const address of addresses) {
        const bytecode = await client.getBytecode({
            address
        })

        if (bytecode === undefined) {
            console.log(`CONTRACT ${address} NOT DEPLOYED!!!`)
            process.exit(1)
        }
    }
}

const walletClient = createWalletClient({
    account: mnemonicToAccount(
        "test test test test test test test test test test test junk"
    ),
    chain: foundry,
    transport: http(process.env.ANVIL_RPC)
})

const anvilClient = createTestClient({
    transport: http(process.env.ANVIL_RPC),
    mode: "anvil"
})

const client = createPublicClient({
    transport: http(process.env.ANVIL_RPC)
})

const main = async () => {
    let nonce = 0
    await anvilClient.setAutomine(true)

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: ENTRY_POINT_V07_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[V0.7 CORE] Deploying EntryPoint"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: SIMPLE_ACCOUNT_FACTORY_V07_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[V0.7 CORE] Deploying SimpleAccountFactory"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: ENTRY_POINT_SIMULATIONS_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[V0.7 CORE] Deploying EntryPointSimulations"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: ENTRY_POINT_V06_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[V0.6 CORE] Deploying EntryPoint"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: SIMPLE_ACCOUNT_FACTORY_V06_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[V0.6 CORE] Deploying SimpleAccountFactory"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: SAFE_V06_MODULE_SETUP_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE V0.6] Deploying Safe Module Setup"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: SAFE_V06_MODULE_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE V0.6] Deploying Safe 4337 Module"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: SAFE_V07_MODULE_SETUP_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE V0.7] Deploying Safe Module Setup"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: SAFE_V07_MODULE_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE V0.7] Deploying Safe 4337 Module"))

    await anvilClient
        .setCode({
            address: SAFE_SINGLETON_FACTORY,
            bytecode: SAFE_SINGLETON_FACTORY_BYTECODE
        })
        .then(() =>
            console.log("[SAFE] Etched Safe Singleton Factory Bytecode")
        )

    walletClient
        .sendTransaction({
            to: SAFE_SINGLETON_FACTORY,
            data: SAFE_PROXY_FACTORY_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE] Deploying Safe Proxy Factory"))

    walletClient
        .sendTransaction({
            to: SAFE_SINGLETON_FACTORY,
            data: SAFE_SINGLETON_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE] Deploying Safe Singleton"))

    walletClient
        .sendTransaction({
            to: SAFE_SINGLETON_FACTORY,
            data: SAFE_MULTI_SEND_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE] Deploying Safe Multi Send"))

    walletClient
        .sendTransaction({
            to: SAFE_SINGLETON_FACTORY,
            data: SAFE_MULTI_SEND_CALL_ONLY_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[SAFE] Deploying Safe Multi Send Call Only"))

    await anvilClient
        .setCode({
            address: BICONOMY_SINGLETON_FACTORY,
            bytecode: BICONOMY_SINGLETON_FACTORY_BYTECODE
        })
        .then(() => console.log("[BICONOMY] Etched Singleton Factory Bytecode"))

    walletClient
        .sendTransaction({
            to: BICONOMY_SINGLETON_FACTORY,
            data: BICONOMY_ECDSA_OWNERSHIP_REGISTRY_MOUDULE_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() =>
            console.log("[BICONOMY] Deployed ECDSA Ownership Registry Module")
        )

    walletClient
        .sendTransaction({
            to: BICONOMY_SINGLETON_FACTORY,
            data: BICONOMY_ACCOUNT_V2_LOGIC_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[BICONOMY] Deploying Account V0.2 Logic"))

    walletClient
        .sendTransaction({
            to: BICONOMY_SINGLETON_FACTORY,
            data: BICONOMY_FACTORY_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[BICONOMY] Deploying Factory"))

    walletClient
        .sendTransaction({
            to: BICONOMY_SINGLETON_FACTORY,
            data: BICONOMY_DEFAULT_FALLBACK_HANDLER_CREATECALL,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() =>
            console.log("[BICONOMY] Deploying Default Fallback Handler")
        )

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: KERNEL_ECDSA_VALIDATOR,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[KERNEL] Deploying ECDSA Validator"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: KERNEL_ACCOUNT_V2_2_LOGIC,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[KERNEL] Deploying Account V2 Logic"))

    walletClient
        .sendTransaction({
            to: DETERMINISTIC_DEPLOYER,
            data: KERNEL_FACTORY_ADDRESS,
            gas: 15_000_000n,
            nonce: nonce++
        })
        .then(() => console.log("[KERNEL] Deploying Kernel Factory"))

    // ==== SETUP KERNEL CONTRACTS ==== //
    const kernelFactoryOwner = "0x9775137314fE595c943712B0b336327dfa80aE8A"
    await anvilClient.setBalance({
        address: kernelFactoryOwner,
        value: parseEther("100")
    })

    await anvilClient.impersonateAccount({
        address: kernelFactoryOwner
    })

    // register 0x0DA6a956B9488eD4dd761E59f52FDc6c8068E6B5
    await sendTransaction(walletClient, {
        account: kernelFactoryOwner,
        to: "0x5de4839a76cf55d0c90e2061ef4386d962E15ae3" /* kernel factory */,
        data: "0xbb30a9740000000000000000000000000da6a956b9488ed4dd761e59f52fdc6c8068e6b50000000000000000000000000000000000000000000000000000000000000001" /* setImplementation(address _implementation,bool _allow) */
    })

    await anvilClient.stopImpersonatingAccount({
        address: kernelFactoryOwner
    })

    await verifyDeployed([
        "0x4e59b44847b379578588920ca78fbf26c0b4956c",
        "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7",
        "0x988C135a1049Ce61730724afD342fb7C56CD2776",
        "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
        "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985",
        "0xb02456A0eC77837B22156CBA2FF53E662b326713",
        "0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47",
        "0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226",
        "0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb",
        "0xa581c4A4DB7175302464fF3C06380BC3270b4037",
        "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
        "0x41675C099F32341bf84BFc5382aF534df5C7461a",
        "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
        "0x9641d764fc13c8B624c04430C7356C1C7C8102e2",
        "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        "0x9406Cc6185a346906296840746125a0E44976454",
        "0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e",
        "0x0000002512019Dafb59528B82CB92D3c5D2423ac",
        "0x000000a56Aaca3e9a4C479ea6b6CD0DbcB6634F5",
        "0x0bBa6d96BD616BedC6BFaa341742FD43c60b83C1",
        "0xd9AB5096a832b9ce79914329DAEE236f8Eea0390",
        "0x0DA6a956B9488eD4dd761E59f52FDc6c8068E6B5",
        "0x5de4839a76cf55d0c90e2061ef4386d962E15ae3"
    ])
}

main()