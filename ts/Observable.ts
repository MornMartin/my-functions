/**
 * 简单观察者
 */
export class Observable<T> {
    private target: T | undefined;
    private listeners: ((res: T) => void)[] = [];
    public get() {
        if(typeof this.target !== "undefined") {
            return Promise.resolve(this.target)
        }
        return new Promise(resolve => {
            this.listeners.push(resolve);
        })
    }
    public set(target: T) {
        this.target = target
        for(const resolve of this.listeners) {
            resolve(target)
        }
        this.listeners = []
    }
}
