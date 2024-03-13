import { nanoid } from 'nanoid';

/**
 * 消息监听函数定义
 */
type TListener<P, T> = (m: IMessage<P, T>) => (void | undefined);
/**
 * 消息广播函数定义
 */
type TBroadcaster<P, T> = (data: IMessage<P, T>['data'], target?: string) => (void | undefined);
/**
 * 广播消息结构
 */
export interface IMessage<P, T> {
    target?: string;// 通知对象ID；指定了ID的为定向消息，否则为广播消息
    source: string;// 消息发送对象ID；
    sourceAlias?: string;// 消息发送对象别名
    seqId: number;// 消息次序ID
    data: {
        protocols: P,
        payload?: T,
    };
}
/**
 * 监听注册反馈结构
 */
export interface IRegisterInfo<P, T> {
    id: string,
    alias?: string,
    broadcaster: TBroadcaster<P, T>,
    unregister: () => (void | undefined)
}
/**
 * 空消息监听函数
 * @returns 
 */
export const nullListener: TListener<any, any> = () => void 0;
/**
 * 空消息广播函数
 * @param data 
 * @param target 
 * @returns 
 */
export const nullBroadcaster: TBroadcaster<any, any> = (data: IMessage<any, any>['data'], target?: string) => void 0;
/**
 * 空取消注册函数
 * @returns 
 */
export const nullUnregister: IRegisterInfo<any, any>['unregister']  = () => void 0;
/**
 * 信道
 */
export default class Channel<P, T> {
    private seqId: number;
    private listeners: {[id: string]: TListener<P, T>};
    constructor() {
        this.seqId = 0;
        this.listeners = {};
    }
    /**
     * 注册
     * @param listener 
     * @returns 
     */
    public register(listener: TListener<P, T>, alias?: string): IRegisterInfo<P, T> {
        const id = nanoid();
        const broadcaster = (data: IMessage<P, T>['data'], target?: string) => {
            this.broadcast(data, id, alias, target);
        }
        const unregister = () => {
            this.unregister(id);
        }
        this.listeners[id] = listener;
        return {id, alias, broadcaster, unregister};
    }
    /**
     * 取消注册
     * @param id 
     */
    public unregister(id: string) {
        delete this.listeners[id];
    }
    /**
     * 广播消息
     * @param source 
     * @param data 
     */
    private broadcast(data: IMessage<P, T>['data'], source: string, alias?: string, target?: string) {
        const message: IMessage<P, T> = {source, sourceAlias: alias, target, seqId: this.seqId++, data};
        // 禁止自己给自己发送消息
        if(target === source) return;
        if(target) { // 单播
            try{
                this.listeners[target](message);
            }catch(err) {
                console.error(err);
            }
            return;
        }
        // 广播
        for(const id in this.listeners) {
            // 屏蔽自己的广播消息
            if(id === source) continue;
            try{
                this.listeners[id](message);
            }catch(err) {
                console.error(err);
            }
        }
    }
    /**
     * 销毁
     */
    public destroy() {
        this.seqId = 0;
        this.listeners = {};
    }
}

