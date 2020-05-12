import parse from "../parser";

describe('parser', () => {

    const log = (...args) => {
        args.forEach(arg => {
            console.log(JSON.stringify(arg, null, 2));
        })
    };

    // TODO: Fix the tests to properly test anything instead of console.log
    it('parses right arrows', () => {
        log(parse("right --> arrow;"));
    });
    it('parses left arrows', () => {
        log(parse("left <-- arrow;"));
    });
    it('parses bi-arrows', () => {
        log(parse("bi <--> arrow;"));
    });
    it('parses lines', () => {
        log(parse("line --- node;"));
    });
    it('parses many arrows in one line', () => {
        log(parse('1 -> 2 <-> 3 <- 4;'))
    });
    it('parses multi line code', () => {
       log(parse(`
         multi -> line;
         code <- cool;
       `))
    });
    it('parses connections with labels', () => {
        log(parse(`
            node -> with_label [test];
        `));
    });
    it('parses code with labels with escaped ]', () => {
        log(parse(`
            node -> with_label [test\\] \\n];
        `));
    });
    it('parses inline labels', () => {
        log(parse(`
            node -> with_label [test] -> no_label;
        `));
    });
    it('parses labeled nodes', () => {
        log(parse(`
            node [label];
        `))
    });
    it(`parses labeled nodes alongside transitions`, () => {
        log(parse(`
            node [label\\]];
            node -[test]-> otherNode;
        `))
    });
    it(`parses connector labels`, () => {
       log(parse(`
        node -[line]- otherNode;
        node -[right]-> yetAnotherNode;
        otherNode -[right]-> yetAnotherNode;
       `));
    });
    it(`works with a complex example`, () => {
        log(parse(`
            node -[line]- otherNode;
            otherNode [has another label];
            node [is labelled here]-[right]-> yetAnotherNode;
            otherNode -[right]-> yetAnotherNode;
            node [has a label];
            node [has another label!];
            newNode [has a label];
            node -> anotherNewNode;
       `));
    });
    it('ignores single line comments', () => {
        log(parse(`# test
        a -> b; # another comment
        # also a comment
        // I am a comment too!
        b -> a; // me too
        // also a comment
        `));
    })
});
