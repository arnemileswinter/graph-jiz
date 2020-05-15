const beginDocument =
    `\\documentclass[12pt]{article}
\\usepackage{tikz}

\\begin{document}

\\begin{center}
\\begin{tikzpicture}[scale=0.2]
`;

const endDocument =
    `\\end{tikzpicture}
\\end{center}

\\end{document}
`;

/**
 * Returns a LaTeX/TikZ document given a parsed graph and positions.
 * @param parsed Contains nodes and connections.
 * @param nodePositions Contains nodeNames as keys, pairs of {x,y} as values.
 * @returns {string} the generated LaTeX document
 */
export default (parsed, nodePositions) => {
    if(!parsed || !nodePositions || parsed.length === 0 || Object.values(nodePositions).length === 0) {
        return beginDocument + endDocument;
    }

    let leftMostPosition = null;
    let topMostPosition = null;
    Object.values(nodePositions).forEach(({x,y}) => {
        leftMostPosition = leftMostPosition === null ? x : x < leftMostPosition ? x : leftMostPosition;
        topMostPosition = topMostPosition === null ? y : y < topMostPosition ? y : topMostPosition;
    });

    let nodeDeclarations = '';
    parsed.nodes.forEach(node => {
        const label = node.labels.length === 0 ? node.name : node.labels.join("\\\\");
        const {x,y} = nodePositions[node.name];
        nodeDeclarations += `\\node[draw, align=center] (${node.name}) at (${
            Math.floor((x - leftMostPosition)*0.125)
        }, ${
            Math.floor((topMostPosition - y)*0.125)
        }) {${label}};\n`;
    });

    let edgeDeclarations = '\\path[->]\n';
    parsed.connections.forEach(connection => {
        const label = connection.labels.length === 0 ? '' : connection.labels.join("\\\\");

        edgeDeclarations += '(' + connection.from + ') edge '
            + (connection.from === connection.to
                ? '[loop above]'
                : '')
            + ' node[align=center] {' + label + '}'
            + (connection.from === connection.to
                ? '()'
                : '(' + connection.to + ')')
            + '\n';
    });
    edgeDeclarations = edgeDeclarations.trimRight();
    edgeDeclarations += ';\n';


    return beginDocument
        + nodeDeclarations
        + edgeDeclarations
        + endDocument;
}
