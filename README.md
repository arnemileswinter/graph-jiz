# GraphJiz
a minimal DOT alternative with a sleek syntax and math support in your browser!

Make sure to [check out the demo](https://arnemileswinter.github.io/graph-jiz/).

### Usage & Syntax
There are 4 connection types supported:

Left to right: `nodeA => nodeB ====> nodeC;`
Right to left: `nodeA <- nodeB <---- nodeC;`
Bidirectional: `nodeA <=> nodeB <--> nodeC;`
Lines:         `nodeA === nodeB ---- nodeC;`

Arrows may be arbitrarily long.

Nodes may be labelled on their own: `myNode[Has a cool label!];`
Or within connections: `myNode [has a cool label!] -> nodeB [is a cool node!];`

Edges are labeled inside their declarations, e.g.
`john -[likes]-> jane -[hates]-> carl -[likes]-> john;`

If a nodes' or edges' label is already declared, more labels are added on a new line.
`john [likes graphs];`
`john [hates carl];`

You can add comments with a leading `#` or `//`.
Each statement must be terminated by a `;`.
Statements may span multiple lines.

Labels are evaluated using MathJax, therefore you can use a subset of LaTeX-Math within $ dollar signs $.

### Example Code
```
flowers <-[are]- roses -[are]-> red;
flowers <-[are]- violets -[are]-> blue;

red --> violets;

blue -[what is a decimal approximation of]> theSquareRootOfTwo [$\sqrt{2}$];
theSquareRootOfTwo[$1.41421356237 ...$];
```

### Special thanks
- for language parsing    https://nearley.js.org/
- for graph visualization https://visjs.org/
- for this textbox        https://codemirror.net/
