import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NftItem } from '../build/NftCollection/tact_NftItem';
import '@ton/test-utils';

describe('NftCollection', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftCollection: SandboxContract<NftCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        nftCollection = blockchain.openContract(
            await NftCollection.fromInit(
                deployer.address,
                beginCell().storeUint(0, 8).storeStringTail('Collection Content').endCell()
            )
        );

        const deployResult = await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'Deploy', queryId: 0n }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftCollection.address,
            deploy: true,
            success: true,
        });
    });

    it('should mint an NFT and respect the trading lock', async () => {
        const user = await blockchain.treasury('user');
        
        // 1. Mint an NFT
        const mintResult = await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            {
                $$type: 'Mint',
                owner: user.address,
                content: beginCell().storeStringTail('NFT 1').endCell(),
            }
        );

        const nft1Addr = await nftCollection.getGetNftAddressByIndex(0n);
        const nft1 = blockchain.openContract(NftItem.fromAddress(nft1Addr));

        // 2. Try to transfer while locked (default is locked)
        const recipient = await blockchain.treasury('recipient');
        const transferResult = await nft1.send(
            user.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Transfer',
                query_id: 1n,
                new_owner: recipient.address,
                response_destination: user.address,
                custom_payload: null,
                forward_amount: 0n,
                forward_payload: beginCell().endCell().asSlice(),
            }
        );

        // Should fail with exit code 405 (or whatever require message throws)
        // In Tact, require(condition, message) throws with a hash or exit code.
        expect(transferResult.transactions).toHaveTransaction({
            from: user.address,
            to: nft1.address,
            success: false,
        });

        // 3. Unlock trading
        await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'ToggleTrading', enabled: true }
        );
        
        // Broadcast unlock to index 0
        await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            { 
                $$type: 'BroadcastLock', 
                locked: false, 
                from_index: 0n, 
                to_index: 1n 
            }
        );

        // 4. Try to transfer again (should succeed)
        const transferResult2 = await nft1.send(
            user.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Transfer',
                query_id: 2n,
                new_owner: recipient.address,
                response_destination: user.address,
                custom_payload: null,
                forward_amount: 0n,
                forward_payload: beginCell().endCell().asSlice(),
            }
        );

        expect(transferResult2.transactions).toHaveTransaction({
            from: user.address,
            to: nft1.address,
            success: true,
        });

        const nftData = await nft1.getGetNftData();
        expect(nftData.owner_address.equals(recipient.address)).toBe(true);
    });
});
