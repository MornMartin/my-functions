/**
 * 自动转换合适的单位
 * @param base data 原数值，unit 基准单位
 * @param units unit 单位，scale 与基准单位的换算比率
 * @param digits 保留小数位
 * @returns 
 */
export const autoUnit = <T>(base: {data: number, unit: T}, units: {unit: T, scale: number}[], digits = 3): {data: number, unit: T} => {
    const sortted = [...units].sort((a, b) => {// 单位从大到小排序
        return a.scale - b.scale;
    })
    const unitLevel = sortted.findIndex(e => e.unit === base.unit);
    const upper = sortted[unitLevel - 1];
    const lower = sortted[unitLevel + 1];
    if(upper && base.data * upper.scale > 1) {// 向上单位换算
        return autoUnit(
            {data: base.data * upper.scale, unit: upper.unit},
            sortted.map(item => {
                return {...item, scale: item.scale / upper.scale}
            })
        )
    }
    if(lower && base.data < 1) {// 向下单位换算
        return autoUnit(
            {data: base.data * lower.scale, unit: lower.unit},
            sortted.map(item => {
                return {...item, scale: item.scale / lower.scale}
            })
        )
    }
    return {...base, data: Number(base.data.toFixed(digits))};
}
