import nearley from "nearley"
import grammar from "./gen/grammar"


const walkAst = (ast) => {
    const foundNodes = {};
    const foundConnections = {};

    const upsertNode = treeNode => {
        foundNodes[treeNode.name] = foundNodes[treeNode.name] || {
            labels: {}
        };
        const foundNode = foundNodes[treeNode.name];
        if(treeNode.label) {
            foundNode.labels[treeNode.label] = true;
        }
        return treeNode.name;
    };

    const upsertConnection = (connector, from, to) => {
        let connectionId;
        switch(connector.type) {
            case "left_arrow":
                connectionId = "<" + from + ";" + to;
                break;
            case "right_arrow":
                connectionId = ">" + from + ";" + to;
                break;
            case "bi_arrow":
                connectionId = ":" + from + ";" + to;
                break;
            case "line":
                connectionId = "-" + from + ";" + to;
                break;
            default:
                throw new Error("Unknown connection type \"" + connector.type + "\"!");
        }
        foundConnections[connectionId] = foundConnections[connectionId] || {
            length: connector.length,
            labels: {}
        };
        const foundConnection = foundConnections[connectionId];
        if(connector.label) {
            foundConnection.labels[connector.label] = true;
        }

    };


    const traverse = (ast) => {
        let returnVal;
        for(const treeNode of ast ) {
            if(treeNode.type === "node") {
                returnVal = upsertNode(treeNode);
            }
            if(treeNode.type === "connection") {
                const from = traverse([treeNode.from]);
                const to = traverse([treeNode.to]);

                upsertConnection(treeNode.connector, from, to);
                returnVal = to;
            }
        }
        return returnVal;
    };
    traverse(ast);

    const nodes = [];

    Object.keys(foundNodes).forEach(key => {
        const node = foundNodes[key];
        nodes.push({
            name: key,
            labels: Object.keys(node.labels)
        });
    });

    const connections = [];
    Object.keys(foundConnections).forEach(key => {
        const keySplit = key.substring(1).split(';');
        const from = keySplit[0];
        const to = keySplit[1];

        const foundConnection = foundConnections[key];

        switch(key.charAt(0)) {
            case '>':
                connections.push({
                    from,
                    to,
                    labels: Object.keys(foundConnection.labels),
                    length: foundConnection.length,
                    variant: 'arrow'
                });
                break;
            case '<':
                connections.push({
                    from: to,
                    to: from,
                    labels: Object.keys(foundConnection.labels),
                    length: foundConnection.length,
                    variant: 'arrow'
                });
                break;
            case ':':
                connections.push({
                    from: from,
                    to: to,
                    labels: Object.keys(foundConnection.labels),
                    length: foundConnection.length,
                    variant: 'arrow'
                });
                connections.push({
                    from: to,
                    to: from,
                    labels: Object.keys(foundConnection.labels),
                    length: foundConnection.length,
                    variant: 'arrow'
                });
                break;
            case '-':
                connections.push({
                    from: from,
                    to: to,
                    labels: Object.keys(foundConnection.labels),
                    length: foundConnection.length,
                    variant: 'line'
                });
                connections.push({
                    from: to,
                    to: from,
                    labels: Object.keys(foundConnection.labels),
                    length: foundConnection.length,
                    variant: 'line'
                });
        }
    });

    return {
        nodes,
        connections
    }
};

export default (code) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(code);
    if(parser.results.length > 1) {
        console.error(parser.results);
        throw new Error('Fatal: ambiguos grammar error! Tell the developers...');
    }
    if(parser.results.length === 0) {
        throw new Error('Error: Input was not parsed.')
    }
    const ast = parser.results[0];
    return walkAst(ast);
}
