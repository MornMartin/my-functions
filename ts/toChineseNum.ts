/**
 * 转中文数字（一万以内）
 */
const toChineseNumInTenThouthands = (num: number | string): string => {
    const tenThousandLength = 4;
    const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['千', '百', '十', ''];
    const zeroStr = nums[0];
    const validNum = `${parseInt(num + '')}`.slice(0, tenThousandLength);
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
    const zeroStr = '零';
    const hundredMillions = splitNums(num, 8).map(item =>{
        const [beforeTenThousands = 0, afterTenThousands = 0] = splitNums(item, 4).reverse();
        // 超过一万的部分
        const transedAfterTenThousands = toChineseNumInTenThouthands(afterTenThousands);
        // 小于一万的部分
        const transedBeforeTenThousands = toChineseNumInTenThouthands(beforeTenThousands);
        const isAfterTenThousandZero = transedAfterTenThousands === zeroStr;
        const isBeforeTenThousandZero = transedBeforeTenThousands === zeroStr;
        return `${transedAfterTenThousands}${ isAfterTenThousandZero ? '' : wan }${isBeforeTenThousandZero ? '' : transedBeforeTenThousands}`;
    });
    return hundredMillions
    .join(yi)
    .replaceAll(new RegExp(`^${zeroStr}|${zeroStr}\$`, 'g'), '')// 去除首尾的零
    .replaceAll(new RegExp(`[${[yi, wan].join('')}]${zeroStr}+[${[yi, wan].join('')}]`, 'g'), e => {// 去除万/亿中间的零
        return e.replaceAll(new RegExp(`${zeroStr}+`, 'g'), '');
    });
}

/**
 * 示例
 * 
 * console.log(toChineseNum(`1234567890123456789`))
 * 
 */
