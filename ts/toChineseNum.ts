const zero = "零";
const one = "一";
const two = "二";
const three = "三";
const four = "四";
const five = "五";
const six = "六";
const seven = "七";
const eight = "八";
const nine = "九";
const tens = "十";
const hundreds = "百";
const thousands = "千";
const tenThousands = "万";
const hundredMillions = "亿";

// const zero = "零";
// const one = "壹";
// const two = "贰";
// const three = "叁";
// const four = "肆";
// const five = "伍";
// const six = "陆";
// const seven = "柒";
// const eight = "捌";
// const nine = "玖";
// const tens = "拾";
// const hundreds = "佰";
// const thousands = "仟";
// const tenThousands = "萬";
// const hundredMillions = "億";

/**
 * 转中文数字（一万以内）
 */
const toChineseNumInTenThouthands = (num: number | string): string => {
    const tenThousandLength = 4;
    const nums = [ zero, one, two, three, four, five, six, seven, eight, nine];
    const units = [thousands, hundreds, tens, ''];
    const numbered = parseInt((num || 0) + '');
    // 非数字返回零
    if(Number.isNaN(numbered)) return zero;
    const validNum = `${numbered}`.slice(0, tenThousandLength);
    const fillNum = `${'0'.repeat(tenThousandLength - validNum.length)}${validNum}`;// 补充至四位
    const endZeroRegx = new RegExp(`${zero}+\$`);
    let temp = '';
    for(let i = 0; i < tenThousandLength; i++) {
        const num = fillNum[i];
        const isZero = nums[num] === zero;
        if(isZero && !temp) continue;// 忽略前置零
        // 若前一个字符是零，后续不再加零，零后面不跟单位
        temp += `${ isZero && endZeroRegx.test(temp) ? '' : nums[num] }${ isZero ? '' : units[i] }`;
    }
    // 为空时返回零
    return temp.replace(endZeroRegx, '') || zero;
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
    const hundredMillionParts = splitNums(num, 8).map(item =>{
        const [beforeTenThousands = 0, afterTenThousands = 0] = splitNums(item, 4).reverse();
        // 超过一万的部分
        const transedAfterTenThousands = toChineseNumInTenThouthands(afterTenThousands);
        // 小于一万的部分
        const transedBeforeTenThousands = toChineseNumInTenThouthands(beforeTenThousands);
        const isAfterTenThousandZero = transedAfterTenThousands === zero;
        const isBeforeTenThousandZero = transedBeforeTenThousands === zero;
        // 是否千以内需要补零
        const isBeforeTenThousandsFix = transedBeforeTenThousands.includes(thousands) ? '' : zero;
        return `${transedAfterTenThousands}${ isAfterTenThousandZero ? '' : tenThousands }${isBeforeTenThousandZero ? '' : `${isBeforeTenThousandsFix}${transedBeforeTenThousands}`}`;
    });
    const dropRedundantZero = (num: string): string => {
        const startZero = new RegExp(`^${zero}+`);
        const endZero = new RegExp(`${zero}+\$`);
        const repeatedZero = new RegExp(`${zero}{2}`, 'g');
        // 去除首尾的零/去除重复零
        const result = num.replace(startZero, '').replace(endZero, '').replaceAll(repeatedZero, zero);
        const betweenZero = new RegExp(`[${hundredMillions}${tenThousands}]${zero}+[${hundredMillions}${tenThousands}]`, 'g');
        if(betweenZero.test(result)) {// 去除万/亿中间的零
            return dropRedundantZero(result.replaceAll(betweenZero, e =>{
                return e.replaceAll(new RegExp(`${zero}+`, 'g'), '');
            }))
        }
        return result;
    }
    return dropRedundantZero(hundredMillionParts.join(hundredMillions)) || zero;
}

/**
 * 示例
 * 
 * console.log(toChineseNum(`1234567890123456789`))
 * 
 */
