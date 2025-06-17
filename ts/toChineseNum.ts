/**
 * 转中文数字（一万以内）
 */
const toChineseNumInTenThouthands = (num: number | string): string => {
    const tenThousandLength = 4;
    const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['千', '百', '十', ''];
    const zeroStr = nums[0];
    const numbered = parseInt((num || 0) + '');
    // 非数字返回零
    if(Number.isNaN(numbered)) return zeroStr;
    const validNum = `${numbered}`.slice(0, tenThousandLength);
    const fillNum = `${'0'.repeat(tenThousandLength - validNum.length)}${validNum}`;// 补充至四位
    const endZeroRegx = new RegExp(`${zeroStr}+\$`);
    let temp = '';
    for(let i = 0; i < tenThousandLength; i++) {
        const num = fillNum[i];
        const isZero = nums[num] === zeroStr;
        if(isZero && !temp) continue;// 忽略前置零
        // 若前一个字符是零，后续不再加零，零后面不跟单位
        temp += `${ isZero && endZeroRegx.test(temp) ? '' : nums[num] }${ isZero ? '' : units[i] }`
    }
    // 为空时返回零
    return temp.replace(endZeroRegx, '') || zeroStr;
}

/**
 * 分割数字字符
 */
const splitNums = (num: number | string, length = 4, others = []): string[] => {
    const numString = `${num}`;
    if(!numString.length){
        return others;
    }
    return splitNums(numString.slice(0, -length), length, [numString.slice(-length), ...others])
}

/**
 * 转中文数字
 */
export const toChineseNum = (num: number | string): string => {
    const yi = '亿';
    const wan = '万';
    const qian = '千';
    const zeroStr = '零';
    const hundredMillions = splitNums(num, 8).map(item =>{
        const [beforeTenThousands = 0, afterTenThousands = 0] = splitNums(item, 4).reverse();
        // 超过一万的部分
        const transedAfterTenThousands = toChineseNumInTenThouthands(afterTenThousands);
        // 小于一万的部分
        const transedBeforeTenThousands = toChineseNumInTenThouthands(beforeTenThousands);
        const isAfterTenThousandZero = transedAfterTenThousands === zeroStr;
        const isBeforeTenThousandZero = transedBeforeTenThousands === zeroStr;
        // 是否千以内需要补零
        const isBeforeTenThousandsFix = transedBeforeTenThousands.includes(qian) ? '' : zeroStr;
        return `${transedAfterTenThousands}${ isAfterTenThousandZero ? '' : wan }${isBeforeTenThousandZero ? '' : `${isBeforeTenThousandsFix}${transedBeforeTenThousands}`}`;
    });
    const dropRedundantZero = (num: string): string => {
        const startZero = new RegExp(`^${zeroStr}+`);
        const endZero = new RegExp(`${zeroStr}+\$`);
        const repeatedZero = new RegExp(`${zeroStr}{2}`, 'g');
        // 去除首尾的零/去除重复零
        const result = num.replace(startZero, '').replace(endZero, '').replaceAll(repeatedZero, zeroStr);
        const betweenZero = new RegExp(`[${yi}${wan}]${zeroStr}+[${yi}${wan}]`, 'g');
        if(betweenZero.test(result)) {// 去除万/亿中间的零
            return dropRedundantZero(result.replaceAll(betweenZero, e =>{
                return e.replaceAll(new RegExp(`${zeroStr}+`, 'g'), '');
            }))
        }
        return result;
    }
    return dropRedundantZero(hundredMillions.join(yi)) || zeroStr;
}

/**
 * 示例
 * 
 * console.log(toChineseNum(`1234567890123456789`))
 * 
 */
