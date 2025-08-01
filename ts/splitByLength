/**
 * 按长度切割字符串/数组
 */
export const splitByLength = (input: string | any[], length: number) => {
    let index = 0;
    const temp = [];
    while(true) {
        const current = input.slice(index * length, ++index * length);
        if(!current.length) {
            return temp;
        }
        temp.push(current);
    }
}

/**
 * 按长度切割字符串/数组（迭代器）
 */
const iterateByLength = function*(input: string | any[], length: number) {
    let index = 0;
    while(true) {
        const current = input.slice(index * length, ++index * length);
        if(!current.length) {
            return null;
        }
        yield current;
    }
}

/**
 * Example
 * 
    const iterator = iterateByLength([1,2,2,2,2,2,2,2,2,2,,2,2,2], 3);
    while(true) {
        const {done, value} = iterator.next();
        if(done) break;
        console.log(value)
    }
 * 
 */
