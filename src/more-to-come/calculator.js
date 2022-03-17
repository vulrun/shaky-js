class Calculator {
    constructor() {
        this.result = 0;
    }

    print() {
        console.log(this.result);
        return this.result;
    }

    add(val) {
        this.result += val;
        return this;
    }

    sub(val) {
        this.result -= val;
        return this;
    }
}

class ScientificCalc extends Calculator {
    square() {
        this.result = this.result * this.result;
        return this;
    }
}

const sc = new ScientificCalc();

sc.add(10).sub(5).square().print();
