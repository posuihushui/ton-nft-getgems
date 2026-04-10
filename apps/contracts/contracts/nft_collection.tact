import "@stdlib/deploy";
import "./nft_item";

// TEP-62 Messages for Collection
message Mint {
    owner: Address;
    content: Cell?;
}

message BatchMint {
    mints: map<Int, Mint>;
}

// Custom Messages for Lock/Unlock
message ToggleTrading {
    enabled: Bool;
}

message BroadcastLock {
    locked: Bool;
    from_index: Int as uint64;
    to_index: Int as uint64;
}

struct CollectionData {
    next_item_index: Int;
    content: Cell;
    owner_address: Address;
}

contract NftCollection with Deployable {
    next_item_index: Int as uint64 = 0;
    owner: Address;
    content: Cell;
    trading_enabled: Bool = false;

    init(owner: Address, content: Cell) {
        self.owner = owner;
        self.content = content;
    }

    receive(msg: Mint) {
        require(sender() == self.owner, "Only owner can mint");
        self._mint(msg.owner, msg.content);
    }

    receive(msg: BatchMint) {
        require(sender() == self.owner, "Only owner can mint");
        let count: Int = 0;
        foreach (i, m in msg.mints) {
            if (count < 50) { // Safety limit per transaction
                self._mint(m.owner, m.content);
                count = count + 1;
            }
        }
    }

    receive(msg: ToggleTrading) {
        require(sender() == self.owner, "Only owner can toggle trading");
        self.trading_enabled = msg.enabled;
    }

    receive(msg: BroadcastLock) {
        require(sender() == self.owner, "Only owner can broadcast");
        let i: Int = msg.from_index;
        let limit: Int = msg.to_index;
        if (limit > self.next_item_index) {
            limit = self.next_item_index;
        }

        while (i < limit) {
            let item_addr: Address = self.get_nft_address_by_index(i);
            send(SendParameters{
                to: item_addr,
                value: ton("0.02"), // Gas for item update
                mode: SendIgnoreErrors,
                body: SetLocked{locked: msg.locked}.toCell()
            });
            i = i + 1;
        }
    }

    fun _mint(new_owner: Address, content: Cell?) {
        let item_init: StateInit = self.get_nft_item_state_init(self.next_item_index);
        let item_addr: Address = contractAddress(item_init);
        
        send(SendParameters{
            to: item_addr,
            value: ton("0.05"), // Deployment cost
            mode: SendIgnoreErrors,
            bounce: false,
            body: Initialize{
                owner: new_owner, 
                content: content, 
                locked: !self.trading_enabled 
            }.toCell(),
            code: item_init.code,
            data: item_init.data
        });
        
        self.next_item_index = self.next_item_index + 1;
    }

    fun get_nft_item_state_init(index: Int): StateInit {
        return initOf NftItem(myAddress(), index);
    }

    get fun get_collection_data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index,
            content: self.content,
            owner_address: self.owner
        };
    }

    get fun get_nft_address_by_index(index: Int): Address {
        let item_init: StateInit = self.get_nft_item_state_init(index);
        return contractAddress(item_init);
    }

    get fun is_trading_enabled(): Bool {
        return self.trading_enabled;
    }
}
