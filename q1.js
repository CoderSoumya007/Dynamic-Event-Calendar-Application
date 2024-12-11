const array1 = [2, 5, 6, 4, 6, 2];
const array2 = array1.reduce(
    (acc,x) => {
        acc += (x * x);
        return acc;
    },
);
0
console.log(array2);