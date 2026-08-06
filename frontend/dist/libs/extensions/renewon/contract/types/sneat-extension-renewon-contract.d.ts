import { EnumAsUnionOfKeys } from '@sneat/core';
import { ISpaceItemNavContext, ISpaceRequest, ISpaceContext } from '@sneat/space-models';
import { IRecord } from '@sneat/data';
import { IWithSpaceIDs, SneatRecordStatus, IWithCreated, IWithRestrictions, IShortSpaceInfo, ICommuneDbo } from '@sneat/dto';
import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

declare const enum ListPage {
    list = "list"
}
type ListPages = EnumAsUnionOfKeys<typeof ListPage>;

type ListStatus = SneatRecordStatus;
interface IQuantity {
    value: number;
    unit: string;
}
interface IListItemCommon extends IListCommon {
    subListId?: string;
    subListType?: ListType;
    quantity?: IQuantity;
    category?: string;
}
type IListItemBase = IListItemCommon;
type ListItemStatus = 'done' | 'active';
interface IListItemBrief extends IListItemBase {
    id: string;
    readonly created?: string;
    readonly emoji?: string;
    readonly status?: ListItemStatus;
    readonly img?: string;
}
interface ListCounts {
    active?: number;
    completed?: number;
}
type ListType = 'buy' | 'watch' | 'cook' | 'do' | 'other' | 'recipes' | 'rsvp';
interface IListCommon {
    title: string;
    img?: string;
    emoji?: string;
    isDone?: boolean;
}
interface IListBase extends IListCommon, IWithSpaceIDs {
    type: ListType;
    shortId?: string;
    status?: ListStatus;
}
interface IListDbo extends IListBase, IWithRestrictions, IWithCreated {
    dtClosed?: number;
    note?: string;
    numberOf?: ListCounts;
    items?: IListItemBrief[];
    commune?: IShortSpaceInfo;
}
declare class ListItemInfoModel {
    static trackBy: (index: number, item: IListItemBrief) => string | number | undefined;
}
declare class ListItemModel {
    static equalListItems(...items: IListItemBrief[]): boolean;
}
interface IListItemDbo extends IListBase, IListItemCommon {
    listId?: string;
    score?: number;
    subListItems?: IListItemBrief[];
}
declare function getListShortUrlId(communeId: string, shortId?: string, id?: string): string | undefined;
interface IListInfo extends IWithRestrictions {
    parentListId?: string;
    parentListType?: ListType;
    type: ListType;
    id?: string;
    shortId?: string;
    title?: string;
    hidden?: boolean;
    space?: IShortSpaceInfo;
    emoji?: string;
    img?: string;
    note?: string;
    itemsCount?: number;
}
interface IListBrief extends IListBase, IWithCreated {
    emoji?: string;
}
declare function isListInfoMatchesListDto(i: IListInfo, l: IRecord<IListDbo>): boolean;
declare function createListInfoFromDto(dto: IListDbo, shortId?: string): IListInfo;

interface IListGroup {
    id: string;
    title?: string;
    type?: ListType;
    emoji?: string;
    lists?: IListInfo[];
}

interface IRenewOnSpaceDbo {
    listGroups?: IListGroup[];
}

type RenewalStatus = 'active' | 'overdue' | 'cancelled' | 'done';
interface IAmount {
    value: number;
    currency: string;
}
interface IRenewalBrief {
    title: string;
    renewalDate: string;
    expiryDate?: string;
    amount?: IAmount;
    autoRenew?: boolean;
    status: RenewalStatus;
    paymentRisk?: boolean;
    counterpartyID?: string;
    documentID?: string;
    assetID?: string;
}
type IRenewalDbo = IRenewalBrief & IWithCreated;
interface ICreateRenewalRequest {
    title: string;
    renewalDate: string;
    expiryDate?: string;
    amount?: IAmount;
    autoRenew?: boolean;
    status?: RenewalStatus;
    paymentRisk?: boolean;
    counterpartyID?: string;
    documentID?: string;
    assetID?: string;
}
interface IRenewalWithID {
    id: string;
    dbo: IRenewalDbo;
}
type RenewalGroupKey = 'upcoming' | 'overdue' | 'atRisk' | 'other';
interface IRenewalGroup {
    key: RenewalGroupKey;
    title: string;
    emoji: string;
    renewals: IRenewalWithID[];
}
declare function groupRenewals(items: readonly IRenewalWithID[], todayISO: string): IRenewalGroup[];

interface IListKey {
    id: string;
    type: ListType;
}
interface IListContext extends ISpaceItemNavContext<IListBrief, IListDbo> {
    type: ListType;
}

type IRenewalContext = ISpaceItemNavContext<IRenewalBrief, IRenewalDbo>;

interface GetOrCreateCommuneItemIds {
    id?: string;
    shortId?: string;
    communeShortId?: string;
}
interface IProgress {
    current: number;
    total: number;
    state?: string;
}
interface IListItemResult {
    message?: string;
    changed?: boolean;
    success: boolean;
    listDto: IListDbo;
    communeDto?: ICommuneDbo;
    listItemDto?: IListItemDbo;
}
interface IListItemsCommandParams {
    space: ISpaceContext;
    list: IListContext;
    items: IListItemBrief[];
}
type ReorderListItemsWorker = (listDto: IListDbo) => void;
interface ICreateListRequest extends ISpaceRequest, IListBrief {
}
interface IListRequest extends ISpaceRequest {
    readonly listID: string;
}
interface ICreateListItemRequest extends IListItemBase {
    id: string;
}
interface ICreateListItemsRequest extends IListRequest {
    items: ICreateListItemRequest[];
}
interface IListItemRequest extends IListRequest {
    itemID: string;
}
interface IListItemIDsRequest extends IListRequest {
    readonly itemIDs: string[];
}
interface IReorderListItemsRequest extends IListItemIDsRequest {
    toIndex: number;
}
type IDeleteListItemsRequest = IListItemIDsRequest;
interface ISetListItemsIsComplete extends IListItemIDsRequest {
    isDone: boolean;
}

interface IRenewOnService {
    createList(request: ICreateListRequest): Observable<IListContext>;
    deleteList(space: ISpaceContext, listId: string): Observable<void>;
    reorderListItems(request: IReorderListItemsRequest): Observable<void>;
    createListItems(params: IListItemsCommandParams): Observable<IListItemResult>;
    setListItemsIsCompleted(request: ISetListItemsIsComplete): Observable<void>;
    deleteListItems(request: IDeleteListItemsRequest): Observable<void>;
    getListById(space: ISpaceContext, listType: ListType, listID: string): Observable<IListContext>;
}
declare const RENEWON_SERVICE: InjectionToken<IRenewOnService>;

export { ListItemInfoModel, ListItemModel, ListPage, RENEWON_SERVICE, createListInfoFromDto, getListShortUrlId, groupRenewals, isListInfoMatchesListDto };
export type { GetOrCreateCommuneItemIds, IAmount, ICreateListItemRequest, ICreateListItemsRequest, ICreateListRequest, ICreateRenewalRequest, IDeleteListItemsRequest, IListBase, IListBrief, IListCommon, IListContext, IListDbo, IListGroup, IListInfo, IListItemBase, IListItemBrief, IListItemCommon, IListItemDbo, IListItemIDsRequest, IListItemRequest, IListItemResult, IListItemsCommandParams, IListKey, IListRequest, IProgress, IQuantity, IRenewOnService, IRenewOnSpaceDbo, IRenewalBrief, IRenewalContext, IRenewalDbo, IRenewalGroup, IRenewalWithID, IReorderListItemsRequest, ISetListItemsIsComplete, ListCounts, ListItemStatus, ListPages, ListStatus, ListType, RenewalGroupKey, RenewalStatus, ReorderListItemsWorker };
