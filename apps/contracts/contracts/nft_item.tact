import "@stdlib/deploy";

message(0x5fcc3d14) Transfer {
    query_id: Int as uint64;
    new_owner: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x05138d91) OwnershipAssigned {
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}

message(0xd53276db) Excesses {
    query_id: Int as uint64;
}

message(0x2fcb26a2) GetStaticData {
    query_id: Int as uint64;
}

message(0x3a4d7e91) OwnershipChanged {
    index: Int as uint64;
    prev_owner: Address;
    new_owner: Address;
}

message(0x0f0a6d5c) ItemInitialized {
    index: Int as uint64;
}

message(0x8b771735) ReportStaticData {
    query_id: Int as uint64;
    index: Int as uint256;
    collection_address: Address;
}

message(0xfe8b8455) Initialize {
    owner: Address;
    content: Cell;
    locked: Bool;
}

message(0x1d4c0e4a) SetLocked {
    locked: Bool;
}

struct NftData {
    init: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address?;
    content: Cell?;
}

fun minTonsForStorage(): Int {
    return ton("0.05");
}

fun ownershipChangedNotifyValue(): Int {
    return ton("0.01");
}

fun itemInitializedNotifyValue(): Int {
    return ton("0.01");
}

fun requireBasechain(address: Address) {
    let parsed: StdAddress = parseStdAddress(address.asSlice());
    require(parsed.workchain == 0, "Only basechain addresses supported");
}

fun hasResponse(address: Address): Bool {
    return address.asSlice().preloadUint(2) != 0;
}

contract NftItem with Deployable {
    collection_address: Address;
    index: Int as uint64;
    owner: Address?;
    content: Cell?;
    locked: Bool = true;
    initialized: Bool = false;
    // Replay protection stays lightweight by storing only the latest successful query_id.
    last_query_id: Int as uint64 = 0;

    init(collection_address: Address, index: Int) {
        self.collection_address = collection_address;
        self.index = index;
    }

    receive() {}

    receive(msg: Initialize) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(ctx.sender == self.collection_address, "Only collection can initialize");
        require(!self.initialized, "Already initialized");

        self.owner = msg.owner;
        self.content = msg.content;
        self.locked = msg.locked;
        self.initialized = true;

        // Collection advances next_item_index only after the item confirms successful initialization.
        send(SendParameters{
            to: self.collection_address,
            value: itemInitializedNotifyValue(),
            mode: SendPayGasSeparately,
            bounce: true,
            body: ItemInitialized{index: self.index}.toCell()
        });
    }

    receive(msg: Transfer) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(self.initialized, "Not initialized");
        require(ctx.sender == self.owner!!, "Only owner can transfer");
        require(!self.locked, "Trading is locked for this item");
        require(msg.query_id > self.last_query_id, "Transfer query_id must be increasing");

        requireBasechain(msg.new_owner);

        let need_response: Bool = hasResponse(msg.response_destination);
        if (need_response) {
            requireBasechain(msg.response_destination);
        }

        // Use the original forward fee to conservatively fund every async message path.
        let fwd_fee: Int = getOriginalFwdFee(ctx.readForwardFee(), false);
        let rest_amount: Int = myBalance() - minTonsForStorage();
        rest_amount = rest_amount - ownershipChangedNotifyValue() - fwd_fee;

        if (msg.forward_amount > 0) {
            rest_amount = rest_amount - msg.forward_amount - fwd_fee;
        }

        if (need_response) {
            rest_amount = rest_amount - fwd_fee;
        }

        require(rest_amount >= 0, "Insufficient value for transfer");

        let previous_owner: Address = self.owner!!;
        self.owner = msg.new_owner;
        // Reset the replay window for the next owner so a seller cannot brick future transfers.
        if (msg.new_owner == previous_owner) {
            self.last_query_id = msg.query_id;
        } else {
            self.last_query_id = 0;
        }

        if (msg.forward_amount > 0) {
            send(SendParameters{
                to: msg.new_owner,
                value: msg.forward_amount,
                mode: SendPayGasSeparately,
                bounce: false,
                body: OwnershipAssigned{
                    query_id: msg.query_id,
                    prev_owner: previous_owner,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // This callback is best-effort observability only, so ignored errors must not block transfer.
        send(SendParameters{
            to: self.collection_address,
            value: ownershipChangedNotifyValue(),
            mode: SendPayGasSeparately | SendIgnoreErrors,
            bounce: false,
            body: OwnershipChanged{
                index: self.index,
                prev_owner: previous_owner,
                new_owner: msg.new_owner
            }.toCell()
        });

        if (need_response) {
            send(SendParameters{
                to: msg.response_destination,
                value: rest_amount,
                mode: SendPayGasSeparately,
                bounce: false,
                body: Excesses{query_id: msg.query_id}.toCell()
            });
        }
    }

    receive(msg: SetLocked) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(self.initialized, "Not initialized");
        require(ctx.sender == self.collection_address, "Only collection can change lock status");
        self.locked = msg.locked;
    }

    receive(msg: GetStaticData) {
        let ctx: Context = context();
        if (ctx.bounced) {
            return;
        }

        require(self.initialized, "Not initialized");
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: ReportStaticData{
                query_id: msg.query_id,
                index: self.index,
                collection_address: self.collection_address
            }.toCell()
        });
    }

    get fun get_nft_data(): NftData {
        // Keep the standard stack order: init, index, collection_address, owner_address, content.
        return NftData{
            init: self.initialized,
            index: self.index,
            collection_address: self.collection_address,
            owner_address: self.owner,
            content: self.content
        };
    }

    get fun is_locked(): Bool {
        return self.locked;
    }
}
