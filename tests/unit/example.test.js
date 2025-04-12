// sum.js
function sum(a, b) {
    return a + b;
}

// sum.test.js
// Keywords:
// Describe the function name
describe("sum function", () => {
    it("should return the sum of two numbers", () => {
        // test() same as it()
        // nest describe -> describe("success", () => {})
            
    // 3 Stpes for testing
        // 01 Set-up
        const a = 1, b = 2;
        // 02 Execute
        const result = sum(a, b);
        // 03 Compare - expect is same as assert
        expect(result).toBe(a + b); // toBe is same as assert.equal
    })
    

})
// testcase