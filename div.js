function div(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero value");
    }
    return a / b;
}
module.exports = div;
