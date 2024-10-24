/**
 * 同步文字大小/行高/容器尺寸相关样式
 * @param target 
 * @param source 
 */
const syncSizeRelStyles = (target: HTMLElement, source: HTMLElement) => {
    const targetStyle = window.getComputedStyle(source, '');
    //仅支持非格式化文本
    source.style.wordBreak = 'break-all';
    source.style.whiteSpace = 'normal';

    target.style.visibility = 'hidden';
    target.style.font = targetStyle.font;
    target.style.width = targetStyle.width;
    target.style.height = targetStyle.height;
    target.style.display = targetStyle.display;
    target.style.boxSizing = targetStyle.boxSizing;
    target.style.padding = targetStyle.padding;
    target.style.border = targetStyle.border;
    target.style.lineHeight = targetStyle.lineHeight;
    target.style.textIndent = targetStyle.textIndent;
    target.style.wordBreak = targetStyle.wordBreak;
    target.style.whiteSpace = targetStyle.whiteSpace;
}
/**
 * 设置文本内容
 * @param target 
 * @param txt 
 */
const setInnerText = (target: HTMLElement, txt: string) => {
    formatInnerTxt(txt).forEach(item => {
        const el = document.createElement('span');
        el.innerText = item;
        target.append(el);
    });
}
/**
 * 格式化文本内容
 * @param txt 
 * @returns 
 */
const formatInnerTxt = (txt: string) => {
    return txt.replaceAll('\n', '').split('');
}
/**
 * 获取元素在容器中是否可见
 * @param el 查询目标元素
 * @param parentRect 容器大小/位置信息
 * @param visibleRatio 可见系数
 * @returns 
 */
export const getElVisibility = (el: HTMLElement, parentRect: DOMRect, visibleRatio = 0.5) => {
    const {
        width: parentWidth,
        height: parentHeight,
        top: parentTop,
        left: parentLeft,
    } = parentRect || (el.parentNode as HTMLElement)?.getBoundingClientRect?.();
    if(!parentWidth || !parentHeight) return { overflowX: 'total', overflowY: 'total' };
    const { width, height, top, left } = el.getBoundingClientRect();
    // 左侧相对于父级左侧距离
    const offsetLeft = left - parentLeft;
    // 顶部相对于父级顶部距离
    const offsetTop = top - parentTop;
    // 右侧相对于父级左侧距离
    const offsetRight = offsetLeft + width;
    // 底部相对于父级顶部距离
    const offsetBottom = offsetTop + height;
    // none 无溢出，total 全部溢出，half 部分溢出；
    const isNoneOverflowX = parentWidth - offsetRight >= 0;// 没有溢出
    const isHalfOverflowX = parentWidth - offsetLeft >= width * visibleRatio;// 部分溢出
    const overflowX = isNoneOverflowX ? 'none' : isHalfOverflowX && "half" || 'total';
    const isNoneOverflowY = parentHeight - offsetBottom >= 0;// 没有溢出
    const isHalfOverflowY = parentHeight - offsetTop >= height * visibleRatio;// 部分溢出
    const overflowY = isNoneOverflowY ? 'none' : isHalfOverflowY && "half" || 'total';
    return { overflowX, overflowY };
}
/**
 * 获取元素文字溢出索引
 * @param el 
 * @returns 
 */
export const getTextOverflowIndex = (el: HTMLElement) => {
    const children = el.children;
    const rect = el.getBoundingClientRect();
    const firstIndex = 0;
    const lastIndex = children.length - 1;
    const toGet = (index, preIndex, histories = new Map()) => {
        const target = children[index];
        const { overflowX, overflowY } = getElVisibility(target as HTMLElement, rect); 
        const isVisible = overflowX !== 'total' && overflowY !== 'total';
        // 索引增量
        const basicIncrement = 1;
        const increment = Math.round(Math.abs(preIndex - index) / 2) || basicIncrement;

        // 若当前可见，向后查询；若当前不可见，向前查询
        const nextIndex = isVisible ? index + increment : index - increment;

        if(nextIndex >= lastIndex) {// 最后一项可见
            return lastIndex;
        }
        if(nextIndex <= firstIndex) {// 第一项不可见
            return firstIndex;
        }
        // 是否完成紧邻后一项查询
        const hasQueryNextOne = histories.has(index + basicIncrement);
        const isNextOneVisible = histories.get(index + basicIncrement);
        if(hasQueryNextOne && !isNextOneVisible && isVisible) {// 当前项可见，下一项不可见
            return index;
        }
        // 是否完成紧邻前一项查询
        const hasQueryPreOne = histories.has(index - basicIncrement);
        const isPreOneVisible = histories.get(index - basicIncrement);
        if(hasQueryPreOne && isPreOneVisible && !isVisible) {// 当前项不可见，前一项可见
            return index - basicIncrement;
        }
        return toGet(nextIndex, index, histories.set(index, isVisible));
    }
    return toGet(lastIndex, 0);
}
/**
 * 自动提示
 * @param source 
 */
export const doAutoTip = (source: HTMLElement) => {
    const virtualContainer = document.createElement(source.tagName);
    syncSizeRelStyles(virtualContainer, source);
    setInnerText(virtualContainer, source.innerText);
    document.body.append(virtualContainer);
    setTimeout(() => {// 等待虚拟容器加载完成
        const index = getTextOverflowIndex(virtualContainer);
        const innerText = formatInnerTxt(source.innerText);
        if(index < innerText.length - 1) {
            source.innerText = innerText.slice(0, index - 3).join('').concat('...');
            source.title = innerText.join('');
        }
        virtualContainer.remove();
    })
}
