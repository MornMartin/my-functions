
interface IRequest<D, E> {
    id: string | number;
    handler: () => Promise<any>;
    retry: number;
    res?: D;
    err?: E;
}

/**
 * 执行并发请求
 * @param requestList 请求函数列表
 * @param maxRetry 最大重试次数
 * @param concurrency 最大并发数量
 * @param isBreakWhenFailure 失败时是否中断后续请求
 */
export const batchRequests = <D, E>(requestList: IRequest<D, E>['handler'][], maxRetry = 3, concurrency = 6, isBreakWhenFailure = true) => {
    if (concurrency < 1) return Promise.reject('并发数不能小于1');
    return new Promise((resolve, reject) => {
        const idList: IRequest<D, E>['id'][] = [];
        const pendingMap: Record<string, IRequest<D, E>> = {};
        const loadingMap: Record<string, IRequest<D, E>> = {};
        const failureMap: Record<string, IRequest<D, E>> = {};
        const successMap: Record<string, IRequest<D, E>> = {};
        const cancelMap: Record<string, IRequest<D, E>> = {};
        let hasFailure = false;
        const setRequest = (request: IRequest<D, E>, status: 'pending' | 'loading' | 'failure' | 'success' | 'cancel') => {
            const { id } = request;
            delete pendingMap[id];
            delete loadingMap[id];
            delete failureMap[id];
            delete successMap[id];
            delete cancelMap[id];
            if (status === 'pending') {
                return pendingMap[id] = request;
            }
            if (status === 'loading') {
                return loadingMap[id] = request;
            }
            if (status === 'failure') {
                return failureMap[id] = request;
            }
            if (status === 'cancel') {
                return cancelMap[id] = request;
            }
            if (status === 'success') {
                return successMap[id] = request;
            }
        }
        const doRequest = (request: IRequest<D, E>) => {
            const { id, handler, retry } = request;
            setRequest(request, 'loading');
            handler()
                .then((res) => {
                    setRequest({ ...request, res }, 'success');
                })
                .catch((err) => {
                    const nextRetry = retry + 1;
                    setRequest({ ...request, retry: nextRetry, err }, 'failure');
                    if (nextRetry > maxRetry) {// 大于最大可重试次数
                        hasFailure = true;
                    } else {
                        doRequest({ ...failureMap[id] });
                    }
                })
                .finally(() => {
                    doNextRequest();
                });
        }
        const doNextRequest = () => {
            if (isBreakWhenFailure && hasFailure) {// 需要执行失败中断时
                for (const id in pendingMap) {
                    setRequest(pendingMap[id], 'cancel');
                }
            }
            const loadingRequestIds = Object.keys(loadingMap);
            const toRequestIds = Object.keys(pendingMap).slice(0, concurrency - loadingRequestIds.length);
            if (toRequestIds.length) {// 未完成，继续上传
                toRequestIds.forEach(id => {
                    doRequest(pendingMap[id]);
                });
                return;
            }
            if (loadingRequestIds.length) {// 未完成，还有上传中
                return;
            }
            const failureRequestIds = Object.keys(failureMap);
            if (failureRequestIds.length) {// 上传完成，有失败
                const combinedData = { ...failureMap, ...successMap, ...cancelMap };
                reject(idList.map(id => combinedData[id]?.res || combinedData[id]?.err));
            } else {// 上传完成，未失败
                const combinedData = successMap;
                resolve(idList.map(id => combinedData[id]?.res));
            }
        }
        requestList.forEach((item, index) => {
            const id = index;
            idList.push(id);// 按顺序记录请求标识；
            setRequest({ id, retry: 0, handler: item }, 'pending');
        });
        doNextRequest();
    })
}

export default batchRequests;
