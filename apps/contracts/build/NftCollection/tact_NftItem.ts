import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Slice;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _new_owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadTupleTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadGetterTupleTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Slice;
}

export function storeOwnershipAssigned(src: OwnershipAssigned) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadOwnershipAssigned(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _prev_owner = sc_0.loadAddress();
    let _forward_payload = sc_0;
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function loadGetterTupleOwnershipAssigned(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.prev_owner);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnershipAssigned(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipAssigned(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadGetterTupleExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadGetterTupleGetStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type OwnershipChanged = {
    $$type: 'OwnershipChanged';
    index: bigint;
    prev_owner: Address;
    new_owner: Address;
}

export function storeOwnershipChanged(src: OwnershipChanged) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(978157201, 32);
        b_0.storeUint(src.index, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeAddress(src.new_owner);
    };
}

export function loadOwnershipChanged(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 978157201) { throw Error('Invalid prefix'); }
    let _index = sc_0.loadUintBig(64);
    let _prev_owner = sc_0.loadAddress();
    let _new_owner = sc_0.loadAddress();
    return { $$type: 'OwnershipChanged' as const, index: _index, prev_owner: _prev_owner, new_owner: _new_owner };
}

function loadTupleOwnershipChanged(source: TupleReader) {
    let _index = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _new_owner = source.readAddress();
    return { $$type: 'OwnershipChanged' as const, index: _index, prev_owner: _prev_owner, new_owner: _new_owner };
}

function loadGetterTupleOwnershipChanged(source: TupleReader) {
    let _index = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _new_owner = source.readAddress();
    return { $$type: 'OwnershipChanged' as const, index: _index, prev_owner: _prev_owner, new_owner: _new_owner };
}

function storeTupleOwnershipChanged(source: OwnershipChanged) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index);
    builder.writeAddress(source.prev_owner);
    builder.writeAddress(source.new_owner);
    return builder.build();
}

function dictValueParserOwnershipChanged(): DictionaryValue<OwnershipChanged> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnershipChanged(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipChanged(src.loadRef().beginParse());
        }
    }
}

export type ItemInitialized = {
    $$type: 'ItemInitialized';
    index: bigint;
}

export function storeItemInitialized(src: ItemInitialized) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(252341596, 32);
        b_0.storeUint(src.index, 64);
    };
}

export function loadItemInitialized(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 252341596) { throw Error('Invalid prefix'); }
    let _index = sc_0.loadUintBig(64);
    return { $$type: 'ItemInitialized' as const, index: _index };
}

function loadTupleItemInitialized(source: TupleReader) {
    let _index = source.readBigNumber();
    return { $$type: 'ItemInitialized' as const, index: _index };
}

function loadGetterTupleItemInitialized(source: TupleReader) {
    let _index = source.readBigNumber();
    return { $$type: 'ItemInitialized' as const, index: _index };
}

function storeTupleItemInitialized(source: ItemInitialized) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.index);
    return builder.build();
}

function dictValueParserItemInitialized(): DictionaryValue<ItemInitialized> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeItemInitialized(src)).endCell());
        },
        parse: (src) => {
            return loadItemInitialized(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index: bigint;
    collection_address: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.index, 256);
        b_0.storeAddress(src.collection_address);
    };
}

export function loadReportStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _index = sc_0.loadUintBig(256);
    let _collection_address = sc_0.loadAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index: _index, collection_address: _collection_address };
}

function loadTupleReportStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index: _index, collection_address: _collection_address };
}

function loadGetterTupleReportStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index: _index, collection_address: _collection_address };
}

function storeTupleReportStaticData(source: ReportStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection_address);
    return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type Initialize = {
    $$type: 'Initialize';
    owner: Address;
    content: Cell;
    locked: boolean;
}

export function storeInitialize(src: Initialize) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4270556245, 32);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeBit(src.locked);
    };
}

export function loadInitialize(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4270556245) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _locked = sc_0.loadBit();
    return { $$type: 'Initialize' as const, owner: _owner, content: _content, locked: _locked };
}

function loadTupleInitialize(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _locked = source.readBoolean();
    return { $$type: 'Initialize' as const, owner: _owner, content: _content, locked: _locked };
}

function loadGetterTupleInitialize(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _locked = source.readBoolean();
    return { $$type: 'Initialize' as const, owner: _owner, content: _content, locked: _locked };
}

function storeTupleInitialize(source: Initialize) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeBoolean(source.locked);
    return builder.build();
}

function dictValueParserInitialize(): DictionaryValue<Initialize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInitialize(src)).endCell());
        },
        parse: (src) => {
            return loadInitialize(src.loadRef().beginParse());
        }
    }
}

export type SetLocked = {
    $$type: 'SetLocked';
    locked: boolean;
}

export function storeSetLocked(src: SetLocked) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(491523658, 32);
        b_0.storeBit(src.locked);
    };
}

export function loadSetLocked(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 491523658) { throw Error('Invalid prefix'); }
    let _locked = sc_0.loadBit();
    return { $$type: 'SetLocked' as const, locked: _locked };
}

function loadTupleSetLocked(source: TupleReader) {
    let _locked = source.readBoolean();
    return { $$type: 'SetLocked' as const, locked: _locked };
}

function loadGetterTupleSetLocked(source: TupleReader) {
    let _locked = source.readBoolean();
    return { $$type: 'SetLocked' as const, locked: _locked };
}

function storeTupleSetLocked(source: SetLocked) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.locked);
    return builder.build();
}

function dictValueParserSetLocked(): DictionaryValue<SetLocked> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetLocked(src)).endCell());
        },
        parse: (src) => {
            return loadSetLocked(src.loadRef().beginParse());
        }
    }
}

export type NftData = {
    $$type: 'NftData';
    init: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address | null;
    content: Cell | null;
}

export function storeNftData(src: NftData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.init);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadNftData(slice: Slice) {
    let sc_0 = slice;
    let _init = sc_0.loadBit();
    let _index = sc_0.loadIntBig(257);
    let _collection_address = sc_0.loadAddress();
    let _owner_address = sc_0.loadMaybeAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NftData' as const, init: _init, index: _index, collection_address: _collection_address, owner_address: _owner_address, content: _content };
}

function loadTupleNftData(source: TupleReader) {
    let _init = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddressOpt();
    let _content = source.readCellOpt();
    return { $$type: 'NftData' as const, init: _init, index: _index, collection_address: _collection_address, owner_address: _owner_address, content: _content };
}

function loadGetterTupleNftData(source: TupleReader) {
    let _init = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddressOpt();
    let _content = source.readCellOpt();
    return { $$type: 'NftData' as const, init: _init, index: _index, collection_address: _collection_address, owner_address: _owner_address, content: _content };
}

function storeTupleNftData(source: NftData) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.init);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection_address);
    builder.writeAddress(source.owner_address);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserNftData(): DictionaryValue<NftData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftData(src)).endCell());
        },
        parse: (src) => {
            return loadNftData(src.loadRef().beginParse());
        }
    }
}

export type NftItem$Data = {
    $$type: 'NftItem$Data';
    collection_address: Address;
    index: bigint;
    owner: Address | null;
    content: Cell | null;
    locked: boolean;
    initialized: boolean;
    last_query_id: bigint;
}

export function storeNftItem$Data(src: NftItem$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeUint(src.index, 64);
        b_0.storeAddress(src.owner);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
        b_0.storeBit(src.locked);
        b_0.storeBit(src.initialized);
        b_0.storeUint(src.last_query_id, 64);
    };
}

export function loadNftItem$Data(slice: Slice) {
    let sc_0 = slice;
    let _collection_address = sc_0.loadAddress();
    let _index = sc_0.loadUintBig(64);
    let _owner = sc_0.loadMaybeAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _locked = sc_0.loadBit();
    let _initialized = sc_0.loadBit();
    let _last_query_id = sc_0.loadUintBig(64);
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, index: _index, owner: _owner, content: _content, locked: _locked, initialized: _initialized, last_query_id: _last_query_id };
}

function loadTupleNftItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _index = source.readBigNumber();
    let _owner = source.readAddressOpt();
    let _content = source.readCellOpt();
    let _locked = source.readBoolean();
    let _initialized = source.readBoolean();
    let _last_query_id = source.readBigNumber();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, index: _index, owner: _owner, content: _content, locked: _locked, initialized: _initialized, last_query_id: _last_query_id };
}

function loadGetterTupleNftItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _index = source.readBigNumber();
    let _owner = source.readAddressOpt();
    let _content = source.readCellOpt();
    let _locked = source.readBoolean();
    let _initialized = source.readBoolean();
    let _last_query_id = source.readBigNumber();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, index: _index, owner: _owner, content: _content, locked: _locked, initialized: _initialized, last_query_id: _last_query_id };
}

function storeTupleNftItem$Data(source: NftItem$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.collection_address);
    builder.writeNumber(source.index);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeBoolean(source.locked);
    builder.writeBoolean(source.initialized);
    builder.writeNumber(source.last_query_id);
    return builder.build();
}

function dictValueParserNftItem$Data(): DictionaryValue<NftItem$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftItem$Data(src)).endCell());
        },
        parse: (src) => {
            return loadNftItem$Data(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    owner: Address;
    content: Cell;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4118766477, 32);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4118766477) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    return { $$type: 'Mint' as const, owner: _owner, content: _content };
}

function loadTupleMint(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCell();
    return { $$type: 'Mint' as const, owner: _owner, content: _content };
}

function loadGetterTupleMint(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCell();
    return { $$type: 'Mint' as const, owner: _owner, content: _content };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type SetMintLock = {
    $$type: 'SetMintLock';
    locked: boolean;
}

export function storeSetMintLock(src: SetMintLock) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(708529245, 32);
        b_0.storeBit(src.locked);
    };
}

export function loadSetMintLock(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 708529245) { throw Error('Invalid prefix'); }
    let _locked = sc_0.loadBit();
    return { $$type: 'SetMintLock' as const, locked: _locked };
}

function loadTupleSetMintLock(source: TupleReader) {
    let _locked = source.readBoolean();
    return { $$type: 'SetMintLock' as const, locked: _locked };
}

function loadGetterTupleSetMintLock(source: TupleReader) {
    let _locked = source.readBoolean();
    return { $$type: 'SetMintLock' as const, locked: _locked };
}

function storeTupleSetMintLock(source: SetMintLock) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.locked);
    return builder.build();
}

function dictValueParserSetMintLock(): DictionaryValue<SetMintLock> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetMintLock(src)).endCell());
        },
        parse: (src) => {
            return loadSetMintLock(src.loadRef().beginParse());
        }
    }
}

export type BroadcastLock = {
    $$type: 'BroadcastLock';
    locked: boolean;
    from_index: bigint;
    to_index: bigint;
}

export function storeBroadcastLock(src: BroadcastLock) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1045387883, 32);
        b_0.storeBit(src.locked);
        b_0.storeUint(src.from_index, 64);
        b_0.storeUint(src.to_index, 64);
    };
}

export function loadBroadcastLock(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1045387883) { throw Error('Invalid prefix'); }
    let _locked = sc_0.loadBit();
    let _from_index = sc_0.loadUintBig(64);
    let _to_index = sc_0.loadUintBig(64);
    return { $$type: 'BroadcastLock' as const, locked: _locked, from_index: _from_index, to_index: _to_index };
}

function loadTupleBroadcastLock(source: TupleReader) {
    let _locked = source.readBoolean();
    let _from_index = source.readBigNumber();
    let _to_index = source.readBigNumber();
    return { $$type: 'BroadcastLock' as const, locked: _locked, from_index: _from_index, to_index: _to_index };
}

function loadGetterTupleBroadcastLock(source: TupleReader) {
    let _locked = source.readBoolean();
    let _from_index = source.readBigNumber();
    let _to_index = source.readBigNumber();
    return { $$type: 'BroadcastLock' as const, locked: _locked, from_index: _from_index, to_index: _to_index };
}

function storeTupleBroadcastLock(source: BroadcastLock) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.locked);
    builder.writeNumber(source.from_index);
    builder.writeNumber(source.to_index);
    return builder.build();
}

function dictValueParserBroadcastLock(): DictionaryValue<BroadcastLock> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBroadcastLock(src)).endCell());
        },
        parse: (src) => {
            return loadBroadcastLock(src.loadRef().beginParse());
        }
    }
}

export type GetRoyaltyParams = {
    $$type: 'GetRoyaltyParams';
    query_id: bigint;
}

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function loadGetterTupleGetRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadGetRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type ReportRoyaltyParams = {
    $$type: 'ReportRoyaltyParams';
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}

export function loadReportRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleReportRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type UpdateRoyalty = {
    $$type: 'UpdateRoyalty';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeUpdateRoyalty(src: UpdateRoyalty) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1871312355, 32);
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}

export function loadUpdateRoyalty(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1871312355) { throw Error('Invalid prefix'); }
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return { $$type: 'UpdateRoyalty' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleUpdateRoyalty(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'UpdateRoyalty' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleUpdateRoyalty(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'UpdateRoyalty' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleUpdateRoyalty(source: UpdateRoyalty) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserUpdateRoyalty(): DictionaryValue<UpdateRoyalty> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateRoyalty(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateRoyalty(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
    };
}

export function loadCollectionData(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadIntBig(257);
    let _collection_content = sc_0.loadRef();
    let _owner_address = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function storeTupleCollectionData(source: CollectionData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner_address);
    return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type RoyaltyParams = {
    $$type: 'RoyaltyParams';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeRoyaltyParams(src: RoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}

export function loadRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type BroadcastFailureState = {
    $$type: 'BroadcastFailureState';
    failure_count: bigint;
    last_failed_address: Address | null;
}

export function storeBroadcastFailureState(src: BroadcastFailureState) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.failure_count, 257);
        b_0.storeAddress(src.last_failed_address);
    };
}

export function loadBroadcastFailureState(slice: Slice) {
    let sc_0 = slice;
    let _failure_count = sc_0.loadIntBig(257);
    let _last_failed_address = sc_0.loadMaybeAddress();
    return { $$type: 'BroadcastFailureState' as const, failure_count: _failure_count, last_failed_address: _last_failed_address };
}

function loadTupleBroadcastFailureState(source: TupleReader) {
    let _failure_count = source.readBigNumber();
    let _last_failed_address = source.readAddressOpt();
    return { $$type: 'BroadcastFailureState' as const, failure_count: _failure_count, last_failed_address: _last_failed_address };
}

function loadGetterTupleBroadcastFailureState(source: TupleReader) {
    let _failure_count = source.readBigNumber();
    let _last_failed_address = source.readAddressOpt();
    return { $$type: 'BroadcastFailureState' as const, failure_count: _failure_count, last_failed_address: _last_failed_address };
}

function storeTupleBroadcastFailureState(source: BroadcastFailureState) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.failure_count);
    builder.writeAddress(source.last_failed_address);
    return builder.build();
}

function dictValueParserBroadcastFailureState(): DictionaryValue<BroadcastFailureState> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBroadcastFailureState(src)).endCell());
        },
        parse: (src) => {
            return loadBroadcastFailureState(src.loadRef().beginParse());
        }
    }
}

export type NftCollection$Data = {
    $$type: 'NftCollection$Data';
    next_item_index: bigint;
    owner: Address;
    collection_content: Cell;
    common_content: Cell;
    royalty_numerator: bigint;
    royalty_denominator: bigint;
    royalty_destination: Address;
    mint_locked: boolean;
    mint_in_progress: boolean;
    lock_broadcast_failure_count: bigint;
    last_failed_lock_address: Address | null;
}

export function storeNftCollection$Data(src: NftCollection$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.next_item_index, 64);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.collection_content);
        b_0.storeRef(src.common_content);
        b_0.storeUint(src.royalty_numerator, 16);
        b_0.storeUint(src.royalty_denominator, 16);
        b_0.storeAddress(src.royalty_destination);
        b_0.storeBit(src.mint_locked);
        b_0.storeBit(src.mint_in_progress);
        b_0.storeUint(src.lock_broadcast_failure_count, 64);
        b_0.storeAddress(src.last_failed_lock_address);
    };
}

export function loadNftCollection$Data(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadUintBig(64);
    let _owner = sc_0.loadAddress();
    let _collection_content = sc_0.loadRef();
    let _common_content = sc_0.loadRef();
    let _royalty_numerator = sc_0.loadUintBig(16);
    let _royalty_denominator = sc_0.loadUintBig(16);
    let _royalty_destination = sc_0.loadAddress();
    let _mint_locked = sc_0.loadBit();
    let _mint_in_progress = sc_0.loadBit();
    let _lock_broadcast_failure_count = sc_0.loadUintBig(64);
    let _last_failed_lock_address = sc_0.loadMaybeAddress();
    return { $$type: 'NftCollection$Data' as const, next_item_index: _next_item_index, owner: _owner, collection_content: _collection_content, common_content: _common_content, royalty_numerator: _royalty_numerator, royalty_denominator: _royalty_denominator, royalty_destination: _royalty_destination, mint_locked: _mint_locked, mint_in_progress: _mint_in_progress, lock_broadcast_failure_count: _lock_broadcast_failure_count, last_failed_lock_address: _last_failed_lock_address };
}

function loadTupleNftCollection$Data(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _owner = source.readAddress();
    let _collection_content = source.readCell();
    let _common_content = source.readCell();
    let _royalty_numerator = source.readBigNumber();
    let _royalty_denominator = source.readBigNumber();
    let _royalty_destination = source.readAddress();
    let _mint_locked = source.readBoolean();
    let _mint_in_progress = source.readBoolean();
    let _lock_broadcast_failure_count = source.readBigNumber();
    let _last_failed_lock_address = source.readAddressOpt();
    return { $$type: 'NftCollection$Data' as const, next_item_index: _next_item_index, owner: _owner, collection_content: _collection_content, common_content: _common_content, royalty_numerator: _royalty_numerator, royalty_denominator: _royalty_denominator, royalty_destination: _royalty_destination, mint_locked: _mint_locked, mint_in_progress: _mint_in_progress, lock_broadcast_failure_count: _lock_broadcast_failure_count, last_failed_lock_address: _last_failed_lock_address };
}

function loadGetterTupleNftCollection$Data(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _owner = source.readAddress();
    let _collection_content = source.readCell();
    let _common_content = source.readCell();
    let _royalty_numerator = source.readBigNumber();
    let _royalty_denominator = source.readBigNumber();
    let _royalty_destination = source.readAddress();
    let _mint_locked = source.readBoolean();
    let _mint_in_progress = source.readBoolean();
    let _lock_broadcast_failure_count = source.readBigNumber();
    let _last_failed_lock_address = source.readAddressOpt();
    return { $$type: 'NftCollection$Data' as const, next_item_index: _next_item_index, owner: _owner, collection_content: _collection_content, common_content: _common_content, royalty_numerator: _royalty_numerator, royalty_denominator: _royalty_denominator, royalty_destination: _royalty_destination, mint_locked: _mint_locked, mint_in_progress: _mint_in_progress, lock_broadcast_failure_count: _lock_broadcast_failure_count, last_failed_lock_address: _last_failed_lock_address };
}

function storeTupleNftCollection$Data(source: NftCollection$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeAddress(source.owner);
    builder.writeCell(source.collection_content);
    builder.writeCell(source.common_content);
    builder.writeNumber(source.royalty_numerator);
    builder.writeNumber(source.royalty_denominator);
    builder.writeAddress(source.royalty_destination);
    builder.writeBoolean(source.mint_locked);
    builder.writeBoolean(source.mint_in_progress);
    builder.writeNumber(source.lock_broadcast_failure_count);
    builder.writeAddress(source.last_failed_lock_address);
    return builder.build();
}

function dictValueParserNftCollection$Data(): DictionaryValue<NftCollection$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftCollection$Data(src)).endCell());
        },
        parse: (src) => {
            return loadNftCollection$Data(src.loadRef().beginParse());
        }
    }
}

 type NftItem_init_args = {
    $$type: 'NftItem_init_args';
    collection_address: Address;
    index: bigint;
}

function initNftItem_init_args(src: NftItem_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeInt(src.index, 257);
    };
}

async function NftItem_init(collection_address: Address, index: bigint) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('te6cckECIAEABlQAAQHAAQEFoPPVAgEU/wD0pBP0vPLICwMCAWIEFgN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRbbPPLgghsFFQSaAZIwf+BwIddJwh+VMCDXCx/eIMAAItdJwSGwklt/4CCCEP6LhFW64wIgghBfzD0Uuo8RMNs8bBYy+EFvJCOSXwnjDn/gIIIQHUwOSroGBwgQAfow0x8BghD+i4RVuvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1NIAVSBsE/hBbyRbAZJfBI67NjY2J4EwFAXHBRTy9IELoQKzEvL0f4IImJaAcX8oyAGCEA8KbVxYyx/LP8kqVTAUQzBtbds8MBAkQwDifxMAwNMfAYIQX8w9FLry4IHTP/pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHSAAGR1JJtAeL6AFFVFRRDMARmgR3pK/L0ggCQWC4gbvLQgCTHBfL0gW1PLLPy9CiBIGMLvBry9CbbPCXbPCCOgybbPN4JCgkKCwAK1wsBwwAAGPpEMIIA2WIBwADy9AOk2zxw+Dr4J28Qggr68IChggiYloChIaEiwgCUIqEhod4nkgGhkTHiggCliSHC//L0CiBu8tCAVHQExwWRJpFw4iPCAJIzM+MNggiYloBzcFROSAwNDgBkbDH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMPoAMXHXIfoAMfoAMKcDqwABjHFTg3AIyFUgghAFE42RUATLHxLLPwEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBzxbJKAQQNlB3FEMwbW3bPDATAsjIVSCCEDpNfpFQBMsfEss/ASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJLkMUR3cUQzBtbds8MASTMDYw4w0EEw8BPHFwBMgBghDVMnbbWMsfyz/JECQQORIUQzBtbds8MBMC4I4wMNMfAYIQHUwOSrry4IHSAAEx+EFvJFsBkVuOEjSBHekj8vQnggC3+gXHBRTy9OJ/4CCCEC/LJqK64wKCEJRqmLa6jqfTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gMHAREgHSMNMfAYIQL8smorry4IHTPwEx+EFvJFsBkVuOy4Ed6STy9HCAQHBUNKvIVSCCEIt3FzVQBMsfEss/y/8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyRA0QTAUQzBtbds8MOJ/EwE8bW0ibrOZWyBu8tCAbyIBkTLiECRwAwSAQlAj2zwwEwHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wgUAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAOLI+EMBzH8BygBVYFB2INdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WFMs/WCBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiIW6zlX8BygDMlHAyygDiygASygDLP8ntVAIBIBcZAhG/2k7Z5tnjY4wbGAACIgIBIBofAhG4/P2zzbPGx1gbHgH27UTQ1AH4Y9IAAY5j+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHTPyDXCwHDAI4f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJRy1yFt4gHSAAGR1JJtAeLSANIA0z9VYGwX4Pgo1wsKgwm68uCJHAFW+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAFkC0QHbPB0ACm1tf3BwAApUcVZTdgARuCvu1E0NIAAYkMpWdw==');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNftItem_init_args({ $$type: 'NftItem_init_args', collection_address, index })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const NftItem_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    2977: { message: `Already initialized` },
    4055: { message: `Only item can confirm mint` },
    4420: { message: `Only owner can update royalty` },
    7657: { message: `Not initialized` },
    8291: { message: `Transfer query_id must be increasing` },
    12308: { message: `Only collection can initialize` },
    14760: { message: `Invalid royalty denominator` },
    19314: { message: `Unexpected mint index` },
    27983: { message: `Trading is locked for this item` },
    36952: { message: `Only owner can transfer` },
    40129: { message: `Only item can notify ownership change` },
    40282: { message: `Invalid range` },
    40609: { message: `No minted items to broadcast` },
    41880: { message: `Range too large` },
    42377: { message: `Insufficient value for transfer` },
    44504: { message: `Mint already in progress` },
    47098: { message: `Only collection can change lock status` },
    54045: { message: `Only owner can broadcast` },
    54169: { message: `Invalid royalty ratio` },
    55650: { message: `Only basechain addresses supported` },
    57579: { message: `Only owner can mint` },
    59449: { message: `Invalid item index` },
    59800: { message: `No mint in progress` },
    60814: { message: `Range exceeds minted items` },
    62399: { message: `Only owner can set mint lock` },
}

const NftItem_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"OwnershipAssigned","header":85167505,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prev_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"OwnershipChanged","header":978157201,"fields":[{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prev_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ItemInitialized","header":252341596,"fields":[{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Initialize","header":4270556245,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SetLocked","header":491523658,"fields":[{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"NftData","header":null,"fields":[{"name":"init","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"NftItem$Data","header":null,"fields":[{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}},{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"last_query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"Mint","header":4118766477,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"SetMintLock","header":708529245,"fields":[{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"BroadcastLock","header":1045387883,"fields":[{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"from_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"to_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetRoyaltyParams","header":1765620048,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportRoyaltyParams","header":2831876269,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"denominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"UpdateRoyalty","header":1871312355,"fields":[{"name":"numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"denominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoyaltyParams","header":null,"fields":[{"name":"numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"denominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BroadcastFailureState","header":null,"fields":[{"name":"failure_count","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"last_failed_address","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"NftCollection$Data","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"common_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"royalty_numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"royalty_denominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"royalty_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"mint_locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"mint_in_progress","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lock_broadcast_failure_count","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"last_failed_lock_address","type":{"kind":"simple","type":"address","optional":true}}]},
]

const NftItem_getters: ABIGetter[] = [
    {"name":"get_nft_data","arguments":[],"returnType":{"kind":"simple","type":"NftData","optional":false}},
    {"name":"is_locked","arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
]

export const NftItem_getterMapping: { [key: string]: string } = {
    'get_nft_data': 'getGetNftData',
    'is_locked': 'getIsLocked',
}

const NftItem_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Initialize"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Transfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetLocked"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetStaticData"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class NftItem implements Contract {
    
    static async init(collection_address: Address, index: bigint) {
        return await NftItem_init(collection_address, index);
    }
    
    static async fromInit(collection_address: Address, index: bigint) {
        const init = await NftItem_init(collection_address, index);
        const address = contractAddress(0, init);
        return new NftItem(address, init);
    }
    
    static fromAddress(address: Address) {
        return new NftItem(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  NftItem_types,
        getters: NftItem_getters,
        receivers: NftItem_receivers,
        errors: NftItem_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | Initialize | Transfer | SetLocked | GetStaticData | Deploy) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Initialize') {
            body = beginCell().store(storeInitialize(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Transfer') {
            body = beginCell().store(storeTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetLocked') {
            body = beginCell().store(storeSetLocked(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetStaticData') {
            body = beginCell().store(storeGetStaticData(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetNftData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_nft_data', builder.build())).stack;
        const result = loadGetterTupleNftData(source);
        return result;
    }
    
    async getIsLocked(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('is_locked', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
}