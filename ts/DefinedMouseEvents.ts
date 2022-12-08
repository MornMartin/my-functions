import Events, { TListener, TOnEmitHandler } from "./Events";
// 鼠标任意键按下/鼠标左键按下/鼠标滚轮按下/鼠标右键按下
export type TMousedown = 'mousedown' | 'lMousedown'| 'wMousedown' | 'rMousedown';
// 鼠标任意键长按/鼠标左键长按/鼠标滚轮长按/鼠标右键长按
export type TLongpress = 'longPress' | 'lLongPress' | 'wLongPress' | 'rLongPress';
// 鼠标任意键释放/鼠标左键释放/鼠标滚轮释放/鼠标右键释放
export type TMouseup = 'mouseup' | 'lMouseup'| 'wMouseup' | 'rMouseup';
// 鼠标移动
export type TMousemove = 'mousemove';
// 鼠标任意键单击/鼠标左键单击/鼠标滚轮单击/鼠标右键单击
export type TClick = 'click' | 'lClick' | 'wClick' | 'rClick';
// 鼠标任意键双击/鼠标左键双击/鼠标滚轮双击/鼠标右键双击
export type TDblclick = 'dblclick' | 'lDblclick' | 'wDblclick' | 'rDblclick';
// 鼠标滚轮滚动/鼠标滚轮向上滚动/鼠标滚轮向下滚动
export type TWheel = 'wheel' | 'wheelUp' | 'wheelDown'
// 自定义鼠标事件
export type TEvent = TMousedown | TMouseup | TMousemove | TClick | TDblclick | TWheel | TLongpress;
// 鼠标键值枚举
export const enum EMouseButton {
    leftButton,
    wheelButton,
    rightButton
}
// 长按/双击间隔有效时长
const INTERVAL_TIME = 1000;

const event = new Events<TEvent>();

export interface IEventInfo {
    x: number,
    y: number,
    deltaY?: number,
    button: EMouseButton,
    target: EventTarget,
    altKey: boolean,
    ctrlKey: boolean,
    shiftKey: boolean,
}

// 生成长按定时器
const generateLongPressTimer = (cbk: () => void) => {
    let timer;
    return {
        down() {
            this.reset();
            timer = setTimeout(cbk, INTERVAL_TIME);
        },
        up() {
            this.reset();
        },
        reset() {
            clearTimeout(timer);
        }
    }
}
// 生成双击双击判断定时器
const generateDblclickTimer = (cbk: () => void) => {
    let count = 0;
    let timer;
    let hasDoCbk = false;
    return {
        click() {
            clearTimeout(timer);
            if(++count >= 2 && !hasDoCbk) {// 点击次数大于等于2时触发回调
                hasDoCbk = true;
                cbk()
            }
            timer = setTimeout(() => {
                count = 0;
                hasDoCbk = false;
            }, INTERVAL_TIME)
        },
        reset() {
            count = 0;
            hasDoCbk = false;
            clearTimeout(timer);
        }
    }
}

// 记录鼠标左键按下
let recordLMousedown: IEventInfo = null;
// 判断鼠标左键是否长按
const emitLLongPress = generateLongPressTimer(() => {
    if(!recordLMousedown) throw Error('缺少事件对象')
    event.emit('longPress', recordLMousedown)
    event.emit('lLongPress', recordLMousedown)
});
// 判断鼠标左键是否双击
const emitLDblclick = generateDblclickTimer(() => {
    if(!recordLMousedown) throw Error('缺少事件对象')
    event.emit('dblclick', recordLMousedown)
    event.emit('lDblclick', recordLMousedown)
})
// 记录鼠标中键按下
let recordWMousedown: IEventInfo = null;
// 判断鼠标中间是否长按
const emitWLongPress = generateLongPressTimer(() => {
    if(!recordWMousedown) throw Error('缺少事件对象')
    event.emit('longPress', recordWMousedown)
    event.emit('wLongPress', recordWMousedown);
});
// 判断鼠标中间是否双击
const emitWDblclick = generateDblclickTimer(() => {
    if(!recordWMousedown) throw Error('缺少事件对象')
    event.emit('dblclick', recordWMousedown)
    event.emit('wDblclick', recordWMousedown)
})
// 记录鼠标右键按下
let recordRMousedown: IEventInfo = null;
// 判断鼠标右键是否长按
const emitRLongPress = generateLongPressTimer(() => {
    if(!recordRMousedown) throw Error('缺少事件对象')
    event.emit('longPress', recordRMousedown)
    event.emit('rLongPress', recordRMousedown)
});
// 判断鼠标右键是否单击
const emitRDblclick = generateDblclickTimer(() => {
    if(!recordRMousedown) throw Error('缺少事件对象')
    event.emit('dblclick', recordRMousedown)
    event.emit('rDblclick', recordRMousedown)
})


// 生成事件信息
export const generateEventInfo = (e: MouseEvent | WheelEvent): IEventInfo => {
    return {
        x: e.x,
        y: e.y,
        deltaY: (e as WheelEvent).deltaY,
        button: e.button,
        target: e.target,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
    }
}

const registerOriginalEvents = () => {
    const mousedown = (e: MouseEvent) => {
        const info = generateEventInfo(e);
        event.emit('mousedown', info)
        if(e.button === EMouseButton.leftButton) {
            recordLMousedown = generateEventInfo(e);
            emitLLongPress.down();
            event.emit('lMousedown', info)
        }else if(e.button === EMouseButton.wheelButton) {
            recordWMousedown = generateEventInfo(e)
            emitWLongPress.down();
            event.emit('wMousedown', info)
        }else if(e.button === EMouseButton.rightButton) {
            recordRMousedown = generateEventInfo(e)
            emitRLongPress.down();
            event.emit('rMousedown', info)
        }
        // console.log('mousedown', e.target)
    }
    const mouseup = (e: MouseEvent) => {
        const info = generateEventInfo(e);
        event.emit('mouseup', info);
        if(e.button === EMouseButton.leftButton) {
            emitLLongPress.up();
            emitLDblclick.click();
            event.emit("lMouseup", info);
            event.emit('click', recordLMousedown);
            event.emit('lClick', recordLMousedown);
        }else if(e.button === EMouseButton.wheelButton) {
            emitWLongPress.up();
            emitWDblclick.click();
            event.emit('wMouseup', info)
            event.emit('click', recordWMousedown);
            event.emit('wClick', recordWMousedown);
        }else if(e.button === EMouseButton.rightButton) {
            emitRLongPress.up();
            emitRDblclick.click();
            event.emit('rMouseup', info);
            event.emit('click', recordRMousedown);
            event.emit('rClick', recordRMousedown);
        }
    }
    const mousemove = (e: MouseEvent) => {
        event.emit('mousemove', generateEventInfo(e))
    }
    const lClick = (e: MouseEvent) => {
        // console.log(e)
    }
    const lDblclick = (e: MouseEvent) => {
        // console.log(e)
    }
    const wheel = (e: WheelEvent) => {
        const isUp = e.deltaY < 0;
        const info = generateEventInfo(e);
        event.emit('wheel', info);
        if(isUp) {
            event.emit('wheelUp', info);
        }else {
            event.emit('wheelDown', info);
        }
    }
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mousedown', mousedown)
    document.addEventListener('mouseup', mouseup)
    document.addEventListener('click', lClick)
    document.addEventListener('dblclick', lDblclick)
    document.addEventListener('wheel', wheel)
    return () => {
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mousedown', mousedown)
        document.removeEventListener('mouseup', mouseup)
        document.removeEventListener('click', lClick)
        document.removeEventListener('dblclick', lDblclick)
        document.removeEventListener('wheel', wheel)
    }
}

let unRegisterOriginalEvents = registerOriginalEvents();

export default {
    set onEmit(hanlder: TOnEmitHandler<TEvent>) {
        event.onEmit = hanlder;
    },
    get onEmit() {
        return event.onEmit;
    },
    on(e: TEvent, handler: TListener) {
        event.on(e, handler);
    },
    off(e: TEvent, handler: TListener) {
        event.off(e, handler)
    },
    reset() {
        this.destroy();
        unRegisterOriginalEvents = registerOriginalEvents();
    },
    destroy() {
        emitLDblclick.reset();
        emitLLongPress.reset();
        emitWDblclick.reset();
        emitWLongPress.reset();
        emitRDblclick.reset();
        emitRLongPress.reset();
        unRegisterOriginalEvents();
        unRegisterOriginalEvents = () => void 0;
    }
};