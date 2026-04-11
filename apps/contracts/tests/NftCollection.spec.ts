import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { NftCollection } from '../build/NftCollection/tact_NftCollection';
import { NftItem } from '../build/NftCollection/tact_NftItem';
import '@ton/test-utils';

describe('NftCollection', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let nftCollection: SandboxContract<NftCollection>;
    let collectionContent = beginCell().storeUint(0, 8).storeStringTail('https://example.com/collection.json').endCell();
    let commonContent = beginCell().storeStringTail('https://example.com/nft/').endCell();

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        nftCollection = blockchain.openContract(
            await NftCollection.fromInit(
                deployer.address,
                collectionContent,
                commonContent,
                25n,
                1000n,
                deployer.address
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

    it('should expose standard collection getters and respect the trading lock', async () => {
        const user = await blockchain.treasury('user');
        const recipient = await blockchain.treasury('recipient');
        const finalRecipient = await blockchain.treasury('final-recipient');
        const itemContent = beginCell().storeStringTail('1.json').endCell();

        const collectionData = await nftCollection.getGetCollectionData();
        expect(collectionData.next_item_index).toBe(0n);
        expect(collectionData.collection_content.equals(collectionContent)).toBe(true);
        expect(collectionData.owner_address.equals(deployer.address)).toBe(true);

        const royalty = await nftCollection.getRoyaltyParams();
        expect(royalty.numerator).toBe(25n);
        expect(royalty.denominator).toBe(1000n);
        expect(royalty.destination.equals(deployer.address)).toBe(true);

        const fullContent = await nftCollection.getGetNftContent(0n, itemContent);
        const expectedFullContent = beginCell()
            .storeUint(1, 8)
            .storeSlice(commonContent.beginParse())
            .storeRef(itemContent)
            .endCell();
        expect(fullContent.equals(expectedFullContent)).toBe(true);

        expect(await nftCollection.getIsMintLocked()).toBe(true);

        const mintResult = await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.1') },
            {
                $$type: 'Mint',
                owner: user.address,
                content: itemContent,
            }
        );
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftCollection.address,
            success: true,
        });

        const nft1Addr = await nftCollection.getGetNftAddressByIndex(0n);
        expect(mintResult.transactions).toHaveTransaction({
            from: nft1Addr,
            to: nftCollection.address,
            op: 0x0f0a6d5c,
            success: true,
        });

        const nft1 = blockchain.openContract(NftItem.fromAddress(nft1Addr));
        const nftDataBeforeUnlock = await nft1.getGetNftData();
        const collectionDataAfterMint = await nftCollection.getGetCollectionData();

        expect(nftDataBeforeUnlock.init).toBe(true);
        expect(nftDataBeforeUnlock.owner_address?.equals(user.address)).toBe(true);
        expect(nftDataBeforeUnlock.content?.equals(itemContent)).toBe(true);
        expect(collectionDataAfterMint.next_item_index).toBe(1n);
        expect(await nft1.getIsLocked()).toBe(true);

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

        expect(transferResult.transactions).toHaveTransaction({
            from: user.address,
            to: nft1.address,
            success: false,
        });

        await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'SetMintLock', locked: false }
        );

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

        expect(await nftCollection.getIsMintLocked()).toBe(false);
        expect(await nft1.getIsLocked()).toBe(false);

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
        expect(transferResult2.transactions).toHaveTransaction({
            from: nft1.address,
            to: nftCollection.address,
            success: true,
        });

        const nftData = await nft1.getGetNftData();
        expect(nftData.owner_address?.equals(recipient.address)).toBe(true);

        const ownerResetTransfer = await nft1.send(
            recipient.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Transfer',
                query_id: 1n,
                new_owner: finalRecipient.address,
                response_destination: recipient.address,
                custom_payload: null,
                forward_amount: 0n,
                forward_payload: beginCell().endCell().asSlice(),
            }
        );

        expect(ownerResetTransfer.transactions).toHaveTransaction({
            from: recipient.address,
            to: nft1.address,
            success: true,
        });

        const selfTransfer = await nft1.send(
            finalRecipient.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Transfer',
                query_id: 2n,
                new_owner: finalRecipient.address,
                response_destination: finalRecipient.address,
                custom_payload: null,
                forward_amount: 0n,
                forward_payload: beginCell().endCell().asSlice(),
            }
        );

        expect(selfTransfer.transactions).toHaveTransaction({
            from: finalRecipient.address,
            to: nft1.address,
            success: true,
        });

        const replayResult = await nft1.send(
            finalRecipient.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'Transfer',
                query_id: 2n,
                new_owner: finalRecipient.address,
                response_destination: finalRecipient.address,
                custom_payload: null,
                forward_amount: 0n,
                forward_payload: beginCell().endCell().asSlice(),
            }
        );

        expect(replayResult.transactions).toHaveTransaction({
            from: finalRecipient.address,
            to: nft1.address,
            success: false,
        });
    });

    it('should reject lock broadcasts when no item has been minted yet', async () => {
        const result = await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'BroadcastLock',
                locked: false,
                from_index: 0n,
                to_index: 0n,
            }
        );

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: nftCollection.address,
            success: false,
        });
    });

    it('should let the owner update royalty and reject non-owner updates', async () => {
        const outsider = await blockchain.treasury('outsider');
        const newRoyaltyRecipient = await blockchain.treasury('royalty-recipient');

        const failedUpdate = await nftCollection.send(
            outsider.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'UpdateRoyalty',
                numerator: 40n,
                denominator: 1000n,
                destination: newRoyaltyRecipient.address,
            }
        );

        expect(failedUpdate.transactions).toHaveTransaction({
            from: outsider.address,
            to: nftCollection.address,
            success: false,
        });

        await nftCollection.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            {
                $$type: 'UpdateRoyalty',
                numerator: 40n,
                denominator: 1000n,
                destination: newRoyaltyRecipient.address,
            }
        );

        const royalty = await nftCollection.getRoyaltyParams();
        expect(royalty.numerator).toBe(40n);
        expect(royalty.denominator).toBe(1000n);
        expect(royalty.destination.equals(newRoyaltyRecipient.address)).toBe(true);
    });

    it('should return the standard empty nft data tuple for an uninitialized item', async () => {
        const uninitializedItem = blockchain.openContract(
            await NftItem.fromInit(nftCollection.address, 99n)
        );

        const deployResult = await uninitializedItem.send(
            deployer.getSender(),
            { value: toNano('0.05') },
            { $$type: 'Deploy', queryId: 0n }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: uninitializedItem.address,
            deploy: true,
            success: true,
        });

        const nftData = await uninitializedItem.getGetNftData();
        expect(nftData.init).toBe(false);
        expect(nftData.index).toBe(99n);
        expect(nftData.collection_address.equals(nftCollection.address)).toBe(true);
        expect(nftData.owner_address).toBeNull();
        expect(nftData.content).toBeNull();
    });
});
