import "@stdlib/deploy";

// TEP-62 Messages
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

message(0x8b771345) ReportStaticData {
    query_id: Int as uint64;
    index: Int as uint256;
    collection_address: Address;
}

// Custom Messages
message Initialize {
    owner: Address;
    content: Cell?;
    locked: Bool;
}

message SetLocked {
    locked: Bool;
}

struct NftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    content: Cell?;
}

contract NftItem with Deployable {
    collection_address: Address;
    index: Int;
    
    owner: Address?;
    content: Cell?;
    locked: Bool = true;
    initialized: Bool = false;

    init(collection_address: Address, index: Int) {
        self.collection_address = collection_address;
        self.index = index;
    }

    receive(msg: Initialize) {
        let ctx: Context = context();
        require(ctx.sender == self.collection_address, "Only collection can initialize");
        require(!self.initialized, "Already initialized");
        
        self.owner = msg.owner;
        self.content = msg.content;
        self.locked = msg.locked;
        self.initialized = true;

        // Refund excess
        if (ctx.value > ton("0.01")) {
             send(SendParameters{
                to: ctx.sender,
                value: 0,
                mode: SendRemainingValue,
                body: Excesses{query_id: 0}.toCell()
            });
        }
    }

    receive(msg: Transfer) {
        let ctx: Context = context();
        require(self.initialized, "Not initialized");
        require(ctx.sender == self.owner!!, "Only owner can transfer");
        
        // Trading Lock Check
        require(!self.locked, "Trading is locked for this item");

        self.owner = msg.new_owner;

        // Forwarding logic
        if (msg.forward_amount > 0) {
            send(SendParameters{
                to: msg.new_owner,
                value: msg.forward_amount,
                mode: SendIgnoreErrors,
                bounce: false,
                body: OwnershipAssigned{
                    query_id: msg.query_id,
                    prev_owner: ctx.sender,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // Refund excesses
        if (msg.response_destination != myAddress()) {
            send(SendParameters{
                to: msg.response_destination,
                value: 0,
                mode: SendRemainingValue,
                body: Excesses{query_id: msg.query_id}.toCell()
            });
        }
    }

    receive(msg: SetLocked) {
        require(sender() == self.collection_address, "Only collection can change lock status");
        self.locked = msg.locked;
    }

    receive(msg: GetStaticData) {
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: ReportStaticData{
                query_id: msg.query_id,
                index: self.index,
                collection_address: self.collection_address
            }.toCell()
        });
    }

    get fun get_nft_data(): NftData {
        return NftData{
            is_initialized: self.initialized,
            index: self.index,
            collection_address: self.collection_address,
            owner_address: self.owner!!,
            content: self.content
        };
    }

    get fun is_locked(): Bool {
        return self.locked;
    }
}
