// a: Math formula
export function sum_to_n_a(n: number): number {
    return n * (n + 1) / 2;
};

// b: For loop
export function sum_to_n_b(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// c: Recursion
export function sum_to_n_c(n: number): number {
    if (n === 0) {
        return 0;
    }
    return n + sum_to_n_c(n - 1);
};

