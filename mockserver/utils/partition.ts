// utils/partition.ts

export const partition = <T>(list: T[], predicate: (item: T) => boolean): [T[], T[]] => {
    const pass: T[] = [];
    const fail: T[] = [];

    list.forEach(item => {
        if (predicate(item)) {
            pass.push(item);
        } else {
            fail.push(item);
        }
    });

    return [pass, fail];
};
