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

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index: bigint;
    collection_address: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2339836741, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.index, 256);
        b_0.storeAddress(src.collection_address);
    };
}

export function loadReportStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339836741) { throw Error('Invalid prefix'); }
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
    content: Cell | null;
    locked: boolean;
}

export function storeInitialize(src: Initialize) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1797275581, 32);
        b_0.storeAddress(src.owner);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
        b_0.storeBit(src.locked);
    };
}

export function loadInitialize(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1797275581) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _locked = sc_0.loadBit();
    return { $$type: 'Initialize' as const, owner: _owner, content: _content, locked: _locked };
}

function loadTupleInitialize(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCellOpt();
    let _locked = source.readBoolean();
    return { $$type: 'Initialize' as const, owner: _owner, content: _content, locked: _locked };
}

function loadGetterTupleInitialize(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCellOpt();
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
        b_0.storeUint(3145694553, 32);
        b_0.storeBit(src.locked);
    };
}

export function loadSetLocked(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3145694553) { throw Error('Invalid prefix'); }
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
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    content: Cell | null;
}

export function storeNftData(src: NftData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.is_initialized);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadNftData(slice: Slice) {
    let sc_0 = slice;
    let _is_initialized = sc_0.loadBit();
    let _index = sc_0.loadIntBig(257);
    let _collection_address = sc_0.loadAddress();
    let _owner_address = sc_0.loadAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, content: _content };
}

function loadTupleNftData(source: TupleReader) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _content = source.readCellOpt();
    return { $$type: 'NftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, content: _content };
}

function loadGetterTupleNftData(source: TupleReader) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _content = source.readCellOpt();
    return { $$type: 'NftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, content: _content };
}

function storeTupleNftData(source: NftData) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.is_initialized);
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
}

export function storeNftItem$Data(src: NftItem$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.owner);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
        b_0.storeBit(src.locked);
        b_0.storeBit(src.initialized);
    };
}

export function loadNftItem$Data(slice: Slice) {
    let sc_0 = slice;
    let _collection_address = sc_0.loadAddress();
    let _index = sc_0.loadIntBig(257);
    let _owner = sc_0.loadMaybeAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _locked = sc_0.loadBit();
    let _initialized = sc_0.loadBit();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, index: _index, owner: _owner, content: _content, locked: _locked, initialized: _initialized };
}

function loadTupleNftItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _index = source.readBigNumber();
    let _owner = source.readAddressOpt();
    let _content = source.readCellOpt();
    let _locked = source.readBoolean();
    let _initialized = source.readBoolean();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, index: _index, owner: _owner, content: _content, locked: _locked, initialized: _initialized };
}

function loadGetterTupleNftItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _index = source.readBigNumber();
    let _owner = source.readAddressOpt();
    let _content = source.readCellOpt();
    let _locked = source.readBoolean();
    let _initialized = source.readBoolean();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, index: _index, owner: _owner, content: _content, locked: _locked, initialized: _initialized };
}

function storeTupleNftItem$Data(source: NftItem$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.collection_address);
    builder.writeNumber(source.index);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeBoolean(source.locked);
    builder.writeBoolean(source.initialized);
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
    content: Cell | null;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4118766477, 32);
        b_0.storeAddress(src.owner);
        if (src.content !== null && src.content !== undefined) { b_0.storeBit(true).storeRef(src.content); } else { b_0.storeBit(false); }
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4118766477) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'Mint' as const, owner: _owner, content: _content };
}

function loadTupleMint(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCellOpt();
    return { $$type: 'Mint' as const, owner: _owner, content: _content };
}

function loadGetterTupleMint(source: TupleReader) {
    let _owner = source.readAddress();
    let _content = source.readCellOpt();
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

export type ToggleTrading = {
    $$type: 'ToggleTrading';
    enabled: boolean;
}

export function storeToggleTrading(src: ToggleTrading) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4051840417, 32);
        b_0.storeBit(src.enabled);
    };
}

export function loadToggleTrading(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4051840417) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

function loadTupleToggleTrading(source: TupleReader) {
    let _enabled = source.readBoolean();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

function loadGetterTupleToggleTrading(source: TupleReader) {
    let _enabled = source.readBoolean();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

function storeTupleToggleTrading(source: ToggleTrading) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    return builder.build();
}

function dictValueParserToggleTrading(): DictionaryValue<ToggleTrading> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeToggleTrading(src)).endCell());
        },
        parse: (src) => {
            return loadToggleTrading(src.loadRef().beginParse());
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
        b_0.storeUint(4229725070, 32);
        b_0.storeBit(src.locked);
        b_0.storeUint(src.from_index, 64);
        b_0.storeUint(src.to_index, 64);
    };
}

export function loadBroadcastLock(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4229725070) { throw Error('Invalid prefix'); }
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

export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    content: Cell;
    owner_address: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.content);
        b_0.storeAddress(src.owner_address);
    };
}

export function loadCollectionData(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadIntBig(257);
    let _content = sc_0.loadRef();
    let _owner_address = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, content: _content, owner_address: _owner_address };
}

function loadTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, content: _content, owner_address: _owner_address };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, content: _content, owner_address: _owner_address };
}

function storeTupleCollectionData(source: CollectionData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.content);
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

export type NftCollection$Data = {
    $$type: 'NftCollection$Data';
    next_item_index: bigint;
    owner: Address;
    content: Cell;
    trading_enabled: boolean;
}

export function storeNftCollection$Data(src: NftCollection$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.next_item_index, 64);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeBit(src.trading_enabled);
    };
}

export function loadNftCollection$Data(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadUintBig(64);
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _trading_enabled = sc_0.loadBit();
    return { $$type: 'NftCollection$Data' as const, next_item_index: _next_item_index, owner: _owner, content: _content, trading_enabled: _trading_enabled };
}

function loadTupleNftCollection$Data(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _trading_enabled = source.readBoolean();
    return { $$type: 'NftCollection$Data' as const, next_item_index: _next_item_index, owner: _owner, content: _content, trading_enabled: _trading_enabled };
}

function loadGetterTupleNftCollection$Data(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _trading_enabled = source.readBoolean();
    return { $$type: 'NftCollection$Data' as const, next_item_index: _next_item_index, owner: _owner, content: _content, trading_enabled: _trading_enabled };
}

function storeTupleNftCollection$Data(source: NftCollection$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeBoolean(source.trading_enabled);
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
    const __code = Cell.fromBase64('te6ccgECGAEABRwAART/APSkE/S88sgLAQIBYgIDA3rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVFds88uCCFAQFAgEgDxAE6gGSMH/gcCHXScIflTAg1wsf3iCCEGsgP726jr0w0x8BghBrID+9uvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHi0gBVIGwT4CCCEF/MPRS6jwgw2zxsFts8f+AgghC7f31ZugYHCAkA5Mj4QwHMfwHKAFVQUGUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYTgQEBzwABIG6VMHABywGOHiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFuIhbrOVfwHKAMyUcDLKAOISygDKAMntVAGINDQ0+EFvJDAygTAUU4HHBfL0gQuhA7MT8vR/AYIImJaAvI6ccIBAIcgBghDVMnbbWMsfyz/JEDR/VTBtbds8MJEx4n8NAMDTHwGCEF/MPRS68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHi+gBRVRUUQzAC9DL4QW8kECNfA4Ed6Sfy9IIAkFgKIG7y0IAhxwUa8vSBbU8ns/L0UzDCAI7FcnBUR8XIVSCCEAUTjZFQBMsfEss/ASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgHPFskQRUOgFEMwbW3bPDAFlBA5bEHi+CgmDQoCwI4gMNMfAYIQu399Wbry4IHSAAExMoIAt/r4QlJwxwXy9H/gIIIQL8smorrjAoIQlGqYtrqOp9MfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8n4QgFwbds8f+AwcAsMAU7HBbOOnnCAQAPIAYIQ1TJ221jLH8s/yRA3QXB/VTBtbds8MJI1MOINAa4w0x8BghAvyyaiuvLggdM/ATH4QnCAQFQzichVIIIQi3cTRVAEyx8Syz/L/wEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJQTB/VTBtbds8MH8NATxtbSJus5lbIG7y0IBvIgGRMuIQJHADBIBCUCPbPDANAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CA4AmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCEb/aTtnm2eNjDBQRAgEgEhMAAiECEbj8/bPNs8bGWBQVABG4K+7UTQ0gABgB8u1E0NQB+GPSAAGOZPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wAg1wsBwwCOH/pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IiUctchbeIB0gABkdSSbQHi0gDSAFVQbBbg+CjXCwqDCboWABgjIG7y0IBUYWBUaGEBXPLgifpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wBZAtEB2zwXAAhtbX9w');
    const __system = Cell.fromBase64('te6cckECGgEABSYAAQHAAQEFoPPVAgEU/wD0pBP0vPLICwMCAWIEEAN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRXbPPLgghUFDwTqAZIwf+BwIddJwh+VMCDXCx/eIIIQayA/vbqOvTDTHwGCEGsgP7268uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHSAAGR1JJtAeLSAFUgbBPgIIIQX8w9FLqPCDDbPGwW2zx/4CCCELt/fVm6BgcICgGINDQ0+EFvJDAygTAUU4HHBfL0gQuhA7MT8vR/AYIImJaAvI6ccIBAIcgBghDVMnbbWMsfyz/JEDR/VTBtbds8MJEx4n8NAMDTHwGCEF/MPRS68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHi+gBRVRUUQzAC9DL4QW8kECNfA4Ed6Sfy9IIAkFgKIG7y0IAhxwUa8vSBbU8ns/L0UzDCAI7FcnBUR8XIVSCCEAUTjZFQBMsfEss/ASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgHPFskQRUOgFEMwbW3bPDAFlBA5bEHi+CgmDQkBTscFs46ecIBAA8gBghDVMnbbWMsfyz/JEDdBcH9VMG1t2zwwkjUw4g0CwI4gMNMfAYIQu399Wbry4IHSAAExMoIAt/r4QlJwxwXy9H/gIIIQL8smorrjAoIQlGqYtrqOp9MfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8n4QgFwbds8f+AwcAsMAa4w0x8BghAvyyaiuvLggdM/ATH4QnCAQFQzichVIIIQi3cTRVAEyx8Syz/L/wEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJQTB/VTBtbds8MH8NATxtbSJus5lbIG7y0IBvIgGRMuIQJHADBIBCUCPbPDANAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CA4AmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwA5Mj4QwHMfwHKAFVQUGUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYTgQEBzwABIG6VMHABywGOHiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFuIhbrOVfwHKAMyUcDLKAOISygDKAMntVAIBIBETAhG/2k7Z5tnjYwwVEgACIQIBIBQZAhG4/P2zzbPGxlgVGAHy7UTQ1AH4Y9IAAY5k+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXACDXCwHDAI4f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJRy1yFt4gHSAAGR1JJtAeLSANIAVVBsFuD4KNcLCoMJuhYBXPLgifpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wBZAtEB2zwXAAhtbX9wABgjIG7y0IBUYWBUaGEAEbgr7tRNDSAAGM/AtyA=');
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
    5340: { message: `Only owner can toggle trading` },
    7657: { message: `Not initialized` },
    12308: { message: `Only collection can initialize` },
    27983: { message: `Trading is locked for this item` },
    36952: { message: `Only owner can transfer` },
    47098: { message: `Only collection can change lock status` },
    54045: { message: `Only owner can broadcast` },
    57579: { message: `Only owner can mint` },
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
    {"name":"ReportStaticData","header":2339836741,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Initialize","header":1797275581,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}},{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SetLocked","header":3145694553,"fields":[{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"NftData","header":null,"fields":[{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"NftItem$Data","header":null,"fields":[{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}},{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"initialized","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Mint","header":4118766477,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"ToggleTrading","header":4051840417,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"BroadcastLock","header":4229725070,"fields":[{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"from_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"to_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"NftCollection$Data","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"trading_enabled","type":{"kind":"simple","type":"bool","optional":false}}]},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Initialize | Transfer | SetLocked | GetStaticData | Deploy) {
        
        let body: Cell | null = null;
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