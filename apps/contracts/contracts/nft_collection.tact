import "@stdlib/deploy";
import "./nft_item";

message(0xf57f638d) Mint {
    owner: Address;
    content: Cell;
}

message(0x2a3b4c5d) SetMintLock {
    locked: Bool;
}

message(0x3e4f5a6b) BroadcastLock {
    locked: Bool;
    from_index: Int as uint64;
    to_index: Int as uint64;
}

message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

message(0x6f89f5e3) UpdateRoyalty {
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

message(0x08f34d6f) WithdrawTon {
    amount: Int as coins;
    destination: Address;
}

struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}

struct RoyaltyParams {
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

struct BroadcastFailureState {
    failure_count: Int;
    last_failed_address: Address?;
}

fun itemDeployValue(): Int {
    return ton("0.07");
}

fun lockBroadcastValue(): Int {
    return ton("0.02");
}

fun minCollectionTonsForStorage(): Int {
    return ton("0.05");
}

fun buildFullContent(common_content: Cell, individual_content: Cell): Cell {
    return beginCell()
        .storeUint(1, 8)
        .storeSlice(common_content.asSlice())
        .storeRef(individual_content)
        .endCell();
}

contract NftCollection with Deployable {
    next_item_index: Int as uint64 = 0;
    owner: Address;
    collection_content: Cell;
    common_content: Cell;
    royalty_numerator: Int as uint16;
    royalty_denominator: Int as uint16;
    royalty_destination: Address;
    mint_locked: Bool = true;
    mint_in_progress: Bool = false;
    // Keep the last bounced lock target for operators without changing the push-broadcast architecture.
    lock_broadcast_failure_count: Int as uint64 = 0;
    last_failed_lock_address: Address?;

    init(
        owner: Address,
        collection_content: Cell,
        common_content: Cell,
        royalty_numerator: Int,
        royalty_denominator: Int,
        royalty_destination: Address,
    ) {
        require(royalty_denominator > 0, "Invalid royalty denominator");
        require(royalty_numerator <= royalty_denominator, "Invalid royalty ratio");

        self.owner = owner;
        self.collection_content = collection_content;
        self.common_content = common_content;
        self.royalty_numerator = royalty_numerator;
        self.royalty_denominator = royalty_denominator;
        self.royalty_destination = royalty_destination;
    }

    receive() {}

    receive(msg: Mint) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(ctx.sender == self.owner, "Only owner can mint");
        require(!self.mint_in_progress, "Mint already in progress");
        self.mint_in_progress = true;
        self.deployItem(self.next_item_index, msg.owner, msg.content, self.mint_locked);
    }

    receive(msg: SetMintLock) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(ctx.sender == self.owner, "Only owner can set mint lock");
        self.mint_locked = msg.locked;
    }

    receive(msg: BroadcastLock) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(ctx.sender == self.owner, "Only owner can broadcast");
        require(self.next_item_index > 0, "No minted items to broadcast");
        require(msg.from_index <= msg.to_index, "Invalid range");
        require(msg.to_index <= self.next_item_index, "Range exceeds minted items");
        require(msg.to_index - msg.from_index <= 250, "Range too large");
        self.last_failed_lock_address = null;

        let i: Int = msg.from_index;
        while (i < msg.to_index) {
            send(SendParameters{
                to: self.get_nft_address_by_index(i),
                value: lockBroadcastValue(),
                bounce: true,
                mode: SendPayGasSeparately,
                body: SetLocked{locked: msg.locked}.toCell()
            });
            i = i + 1;
        }
    }

    // Record bounced SetLocked pushes so operators can inspect the latest failed target.
    bounced(msg: SetLocked) {
        msg;
        let ctx: Context = context();
        self.lock_broadcast_failure_count = self.lock_broadcast_failure_count + 1;
        self.last_failed_lock_address = ctx.sender;
    }

    // Mint index advances only after the expected item confirms initialization.
    receive(msg: ItemInitialized) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(self.mint_in_progress, "No mint in progress");
        require(msg.index == self.next_item_index, "Unexpected mint index");
        require(ctx.sender == self.get_nft_address_by_index(msg.index), "Only item can confirm mint");

        self.mint_in_progress = false;
        self.next_item_index = self.next_item_index + 1;
    }

    // If item deployment or initialization fails, clear the pending mint instead of burning the index.
    bounced(msg: bounced<Initialize>) {
        msg;
        let ctx: Context = context();

        if (self.mint_in_progress && ctx.sender == self.get_nft_address_by_index(self.next_item_index)) {
            self.mint_in_progress = false;
        }
    }

    receive(msg: GetRoyaltyParams) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: ReportRoyaltyParams{
                query_id: msg.query_id,
                numerator: self.royalty_numerator,
                denominator: self.royalty_denominator,
                destination: self.royalty_destination
            }.toCell()
        });
    }

    receive(msg: UpdateRoyalty) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(ctx.sender == self.owner, "Only owner can update royalty");
        require(msg.denominator > 0, "Invalid royalty denominator");
        require(msg.numerator <= msg.denominator, "Invalid royalty ratio");

        self.royalty_numerator = msg.numerator;
        self.royalty_denominator = msg.denominator;
        self.royalty_destination = msg.destination;
    }

    receive(msg: WithdrawTon) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(ctx.sender == self.owner, "Only owner can withdraw TON");
        require(msg.amount > 0, "Withdraw amount must be positive");

        // Keep a permanent storage reserve so operational withdrawals cannot empty the collection.
        let fwd_fee: Int = getOriginalFwdFee(ctx.readForwardFee(), false);
        let withdrawable: Int = myBalance() - minCollectionTonsForStorage() - fwd_fee;

        require(withdrawable > 0, "No withdrawable TON available");
        require(msg.amount <= withdrawable, "Withdraw amount exceeds available TON");

        send(SendParameters{
            to: msg.destination,
            value: msg.amount,
            mode: SendPayGasSeparately,
            bounce: false
        });
    }

    // Accept best-effort ownership callbacks from items without making transfer depend on collection state.
    receive(msg: OwnershipChanged) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(msg.index < self.next_item_index, "Invalid item index");
        require(ctx.sender == self.get_nft_address_by_index(msg.index), "Only item can notify ownership change");
        msg.prev_owner;
        msg.new_owner;
    }

    fun deployItem(index: Int, new_owner: Address, item_content: Cell, locked: Bool) {
        let item_init: StateInit = self.get_nft_item_state_init(index);
        send(SendParameters{
            to: contractAddress(item_init),
            value: itemDeployValue(),
            mode: SendPayGasSeparately,
            bounce: true,
            body: Initialize{
                owner: new_owner,
                content: item_content,
                locked: locked
            }.toCell(),
            code: item_init.code,
            data: item_init.data
        });
    }

    fun get_nft_item_state_init(index: Int): StateInit {
        return initOf NftItem(myAddress(), index);
    }

    get fun get_collection_data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index,
            collection_content: self.collection_content,
            owner_address: self.owner
        };
    }

    get fun get_nft_address_by_index(index: Int): Address {
        let item_init: StateInit = self.get_nft_item_state_init(index);
        return contractAddress(item_init);
    }

    get fun royalty_params(): RoyaltyParams {
        return RoyaltyParams{
            numerator: self.royalty_numerator,
            denominator: self.royalty_denominator,
            destination: self.royalty_destination
        };
    }

    get fun get_broadcast_failure_state(): BroadcastFailureState {
        return BroadcastFailureState{
            failure_count: self.lock_broadcast_failure_count,
            last_failed_address: self.last_failed_lock_address
        };
    }

    get fun get_nft_content(index: Int, individual_content: Cell): Cell {
        index;
        return buildFullContent(self.common_content, individual_content);
    }

    get fun is_mint_locked(): Bool {
        return self.mint_locked;
    }
}
