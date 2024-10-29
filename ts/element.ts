/**
 * 元素属性
 */
type TElAttribute = Record<string, string>;
/**
 * 元素样式
 */
type TElStyle = CSSStyleDeclaration | Record<string, string>;
/**
 * 元素事件函数
 */
type TElEventHandler = ( e?:any ) => void;
/**
 * 元素事件
 */
type TElEvent = Record<string, TElEventHandler>;
/**
 * 元素内容(单项)
 */
type TElContent = string | HTMLElement;
/**
 * 元素内容（单项/列表）
 */
type TElcontents = TElContent | (string | HTMLElement)[]

/**
 * 创建元素选项
 */
export interface IElOptions {
    attrs?: TElAttribute;
    styles?: TElStyle;
    events?: TElEvent;
}
/**
 * 创建元素
 * @param tagName 
 * @returns 
 */
export const createElement = (tagName: string, content: TElcontents, options?: IElOptions): HTMLElement => {
    const el = document.createElement(tagName);
    setElAttribute(el, options?.attrs);
    setElEvents(el, options?.events);
    setElStyle(el, options?.styles);
    setElContents(el, content);
    return el;
}
/**
 * 设置元素内容（单项）
 * @param el 
 * @param content 
 * @param clearBefore 
 * @returns 
 */
const setElContent = (el: HTMLElement, content: string | HTMLElement, clearBefore = true) => {
    if(clearBefore) {
        el.innerHTML = '';
    }
    if((content as HTMLElement)?.tagName) {
        el.appendChild(content as HTMLElement)
    }else {
        el.append((content as string) || '')
    }
    return el;
}
/**
 * 设置元素内容(单项/多项)
 * @param el 
 * @param contents 
 * @returns 
 */
export const setElContents = (el: HTMLElement, contents: TElcontents): HTMLElement => {
    el.innerHTML = '';
    if(Array.isArray(contents)) {
        setElContent(el, '', true)
        for(const c of contents) {
            setElContent(el, c, false)
        }
        return el;
    }
    return setElContent(el, contents, true);
}
/**
 * 设置元素属性
 * @param el 
 * @param attrs 
 * @returns 
 */
export const setElAttribute = (el: HTMLElement, attrs: TElAttribute): HTMLElement => {
    for(const k in (attrs || {})) {
        switch(k) {
            case 'className': {
                el[k] = attrs[k];
            }
            default: {
                el.setAttribute(k, attrs[k]);
            }
        }
    }
    return el;
}
/**
 * 设置元素样式
 * @param el 
 * @param styles 
 * @returns 
 */
export const setElStyle = (el: HTMLElement, styles: TElStyle): HTMLElement => {
    for(const k in (styles || {})) {
        el.style[k] = styles[k]
    }
    return el;
}
/**
 * 添加元素类选择器
 * @param el 
 * @param cls 
 */
export const addElCls = (el: HTMLElement, cls: string) => {
    const classes = el.className.split(/\s+/);
    if(classes.includes(cls)) return el;
    el.className = classes.concat([cls]).join(' ');
    return el;
}
/**
 * 移除元素类选择器
 * @param el 
 * @param cls 
 * @returns 
 */
export const removeElCls = (el: HTMLElement, cls: string) => {
    const classes = el.className.split(/\s+/);
    el.className = classes.filter(item => item !== cls).join(' ')
    return el;
}
/**
 * 切换元素类选择器
 * @param el 
 * @param cls 
 */
export const toggleElCls = (el: HTMLElement, cls: string) => {
    const classes = el.className.split(/\s+/);
    if(classes.includes(cls)) {
        removeElCls(el, cls)
    }else {
        addElCls(el, cls)
    }
}
/**
 * 设置元素类选择器
 * @param el 
 * @param cls 
 * @returns 
 */
export const setElCls = (el: HTMLElement, cls: string) => {
    el.className = cls;
    return el;
}

/**
 * 设置元素事件
 * @param el 
 * @param events 
 * @returns 
 */
export const setElEvents = (el: HTMLElement, events: TElEvent): HTMLElement => {
    for(const k in (events || {})) {
        el[k] = events[k]
    }
    return el;
} 
/**
 * 创建div
 * @param content 
 * @param options 
 * @returns 
 */
export const div = (contents?: TElContent | TElcontents, options?: IElOptions): HTMLElement => {
    return createElement('div', contents, options);
}
/**
 * 创建ul
 * @param contents 
 * @param options 
 * @returns 
 */
export const ul = (contents: (string | HTMLElement)[], options?: {ul?: IElOptions, li?: IElOptions}): HTMLElement => {
    const list = contents.map(item => {
        return createElement('li', item, options?.li);
    })
    return createElement('ul', list, options?.ul);
}
/**
 * 创建button
 * @param contents 
 * @param options 
 * @returns 
 */
export const button = (contents?: TElContent | TElcontents, options?: IElOptions): HTMLElement => {
    return createElement('button', contents, options);
}
/**
 * 创建label
 * @param contents 
 * @param options 
 * @returns 
 */
export const label = (contents?: TElContent | TElcontents, options?: IElOptions): HTMLElement => {
    return createElement('label', contents, options);
}
/**
 * 创建input
 * @param value 
 * @param options 
 * @returns 
 */
 export const input = (value?: string | number, options?: IElOptions): HTMLInputElement => {
    const el = document.createElement('input');
    el.value = value as string;
    setElAttribute(el, options?.attrs);
    setElEvents(el, options?.events);
    setElStyle(el, options?.styles);
    return el;
}
/**
 * 创建style
 * @param css 
 * @param options 
 * @returns 
 */
export const style = (css: string, options?: IElOptions): HTMLElement => {
    const el = document.createElement('style');
    el.innerHTML = css;
    setElAttribute(el, options?.attrs);
    return el;
}
/**
 * 创建img
 * @param src 
 * @param options 
 * @returns 
 */
export const img = (src: string, options?: IElOptions): HTMLElement => {
    const el = document.createElement('img');
    el.src = src;
    setElAttribute(el, options?.attrs);
    setElEvents(el, options?.events);
    setElStyle(el, options?.styles);
    return el;
}
