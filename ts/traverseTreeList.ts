/**
 * 遍历一个树形结构
 * @param list 数据
 * @param cbk 回调：若返回true则终止遍历，返回undefined或false都会继续遍历行为
 * @param childrenKey 子集属性名称
 * @param parents 父级元素 
 * @returns 是否被中断
 */
 export const traverseTreeList = <T>(list: T[], cbk: (e: T, paths: T[]) => (boolean | void), childrenKey = 'children', parents: T[] = []): boolean => {
    for(let i = 0, item; item = list[i]; i++) {
        const isBreak = cbk(item, [...parents, item]);
        if(isBreak) return true;
        const children = item[childrenKey];
        if(children && children.length) {
            const isBreak = traverseTreeList(children, cbk, childrenKey, [...parents, item]);
            if(isBreak) return isBreak;
        }
    }
    return false;
};
