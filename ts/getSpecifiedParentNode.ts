/**
 * 获取节点的指定父级节点
 */
 export const getSpecifiedParentNode = (
    node: HTMLElement,
    mark: string,
    by: 'class' | 'attr' = 'class'
): HTMLElement => {
    if (!node) return node;
    if (by === 'class') {
        const classNames = node.className.split(/\s/);
        return (
            (classNames.includes(mark) && node) || getSpecifiedParentNode(node.parentNode as HTMLElement, mark, by)
        );
    }
    if (by === 'attr') {
        return (node.hasAttribute(mark) && node) || getSpecifiedParentNode(node.parentNode as HTMLElement, mark, by);
    }
    throw Error('传入的筛选类型不合法');
};
