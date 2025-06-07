/**
 * 获取随机文本
 */
const getRamdomCharts = (length: number, candidates: (string | number)[]): string => {
    const [, random] = `${Math.random()}`.split('.');
    const repeat = Math.ceil(length / random.length);
    const salt = Math.ceil(Math.random() * Math.pow(10, 3));
    return random
        .repeat(repeat)
        .slice(0, length)
        .split('')
        .map(index => candidates[Number(index) * salt % candidates.length])
        .join('');
}

/**
 * 生成区间字符集
 */
const generateChartsRange = (chartStart: string, chartEnd: string) => {
    const charCodeStart = Math.min(chartStart.charCodeAt(0), chartEnd.charCodeAt(0));
    const charCodeEnd = Math.max(chartStart.charCodeAt(0), chartEnd.charCodeAt(0));
    const temp = [];
    for(let i = charCodeStart; i <= charCodeEnd; i++) {
        temp.push(String.fromCharCode(i))
    }
    return temp;
}

/**
 * 生成完整候选字符
 */
const generateFullCandidates = (candidates?: (string | number)[]): (string | number)[] =>{
    let temp = [];
    const rangeRegx = /^\w-\w$/;
    candidates.forEach(item => {
        if(rangeRegx.test(`${item}`)) {
            const [chartStart, chartEnd] = `${item}`.split('-');
            temp = temp.concat(generateChartsRange(chartStart, chartEnd));
        }else{
            temp.push(item)
        }
    })
    return temp;
}

/**
 * 获取数字动画帧
 */
const getNumberFlipFrame = (target: string | number, percent: number, candidates: (string | number)[] = ['0-9']) => {
    if(Number.isNaN(Number(target))) return target;
    const fullFillCandidates = generateFullCandidates(candidates);
    const [intNums = '', floatNums = ''] = `${target}`.split('.');
    const allNums = intNums + floatNums;
    const changeIndex = Math.floor(allNums.length * percent);
    const changeNums = allNums.slice(changeIndex);
    const random = getRamdomCharts(changeNums.length, fullFillCandidates);
    const changedAllNums = allNums.slice(0, changeIndex) + random;
    return `${changedAllNums.slice(0, intNums.length)}${floatNums.length ? `.${changedAllNums.slice(intNums.length)}` : ''}`
}

/**
 * 获取文本动画帧
 */
const getStringFlipFrame = (target: string, percent: number, candidates: (string | number)[] = ['a-z', 'A-Z', '0-9']) => {
    const fullFillCandidates = generateFullCandidates(candidates);
    const changeIndex = Math.floor(target.length * percent);
    const changeNums = target.slice(changeIndex);
    const random = getRamdomCharts(changeNums.length, fullFillCandidates);
    return target.slice(0, changeIndex) + random;
}

/**
 * 生成动画迭代器
 */
export function* createFlipAnimation (target: string | number, totalFrame: number, candidates?: (string | number)[]) {
    const isNumber = !Number.isNaN(Number(target));
    for(let i = 0; i <= totalFrame; i++) {
        const percent = i / totalFrame;
        yield isNumber ? getNumberFlipFrame(`${target || 0}`, percent, candidates) : getStringFlipFrame(`${target || ''}`, percent, candidates);
    }
    return target;
}

/**
 * Example
 * 
 * 
    const container = document.getElementById('test');
    const target = Math.random() * Math.pow(10, 7);
    const animation = createFlipAnimation(target, 100);
    const toAnimate = () =>{
        const res = animation.next();
        container.innerHTML = res.value as string;
        if(!res.done) {
            requestAnimationFrame(toAnimate);
        }
    }
    requestAnimationFrame(toAnimate);
 * 
 * 
 */
