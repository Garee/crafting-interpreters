import TLox from "../tlox";

describe("tlox", () => {
    const tlox = new TLox();

    const mockConsole = {
        log: jest.fn(),
    };

    beforeAll(() => {
        console.log = mockConsole.log;
    });

    it("should support a built-in 'print' function", () => {
        const code = `
            print "one";
            print true;
            print 2 + 1;
        `;

        tlox.run(code);

        expect(mockConsole.log).toHaveBeenCalledTimes(3);
        expect(mockConsole.log.mock.calls[0][0]).toBe("one");
        expect(mockConsole.log.mock.calls[1][0]).toBe("true");
        expect(mockConsole.log.mock.calls[2][0]).toBe("3");
    });

    it("should support defining and calling functions", () => {
        const code = `
            fun sayHi(first, last) {
                print "Hi, " + first + " " + last + "!";
            }

            sayHi("Dear", "Reader");
        `;

        tlox.run(code);

        expect(mockConsole.log).toHaveBeenCalledTimes(1);
        expect(mockConsole.log.mock.calls[0][0]).toBe("Hi, Dear Reader!");
    });
});
