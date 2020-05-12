<template>
    <div ref="graph" class="graph" v-once/>
</template>

<script>
import * as vis from "vis-network/standalone";
import parse from "./parser/parser";

export default {
    data() {
        return ({
            parsed: [],
            nodeData: []
        })
    },
    props: {
        markup: {
            type: String,
            required: true
        }
    },
    watch: {
        markup() {
            try {
                this.parsed = parse(this.markup);
                this.drawGraph();
            } catch(e) {
                this.parsed = [];

                const message = "" + e.message;

                if(message.startsWith("Syntax")) {
                    const firstErrorLine = message.split('\n')[0];
                    const line = parseInt(firstErrorLine.split('line ', 2)[1].split(' ', 2)[0]);
                    const col = parseInt(firstErrorLine.split('col ', 2)[1].split(':', 2)[0]);
                    this.$emit('parseError', {
                        type: "syntax-error",
                        line,
                        col
                    });
                }
            }
        }
    },
    methods: {
        drawGraph() {
            const mathJax = window.MathJax;

            const $el = this.$refs.graph;
            $el.innerHTML = '';

            const labelToSvg = (labels, fallback = "") => {
                const labelContent = labels.length === 0
                    ? "\\textsf{ " + fallback + " }"
                    : "\\begin{align*} "
                    + labels.map(
                        label => label.split('\n').map(line => "& \\textsf{ " + line + " } ").join("\\\\")
                    ).join("\\\\")
                    + "\\end{align*}";

                const svgElement = mathJax.tex2svg(labelContent).children[0];

                const svgWhiteBackground = document.createElement('style');
                svgWhiteBackground.innerHTML = "svg {background-color: white; position: fixed; }";

                svgElement.appendChild(svgWhiteBackground);

                return svgElement.outerHTML;
            };

            const nodes = new vis.DataSet(this.parsed.nodes.map((node) => {

                return ({
                    id: node.name,
                    color: {
                        border: '#000',
                        background: 'white',
                        highlight: {
                            background: 'white'
                        }
                    },
                    shape: "image",
                    image: "data:image/svg+xml;base64," + btoa(labelToSvg(node.labels, node.name)),
                    imagePadding: {
                      top: 5,
                      left: 5,
                      right: 5,
                      bottom: 5
                    },
                    shapeProperties: {
                        useImageSize: true,
                        useBorderWithImage: true
                    }
                })
            }));

            const edges = new vis.DataSet(this.parsed.connections.map(connection => {
                let edge = {};
                if(connection.variant === "arrow") {
                    edge.arrows = {to: {enabled: true}};
                }
                if(connection.labels.length > 0) {
                    edge.arrows = {
                        ...edge.arrows,
                        middle: {
                            enabled: true,
                            src:  "data:image/svg+xml;base64," + btoa(labelToSvg(connection.labels)),
                            type: "image"
                        }
                    }
                }
                edge = {
                    ...edge,
                    from: connection.from,
                    to: connection.to,
                    color: {
                        color:'#000',
                        opacity:1.0,
                        highlight: '#000'
                    },
                    selectionWidth: 0,
                    length: connection.length * 100,
                    smooth: {
                        "type": "discrete"
                    }
                };

                return edge;
            }));

            const container = $el;
            const data = {
                nodes,
                edges
            };
            let options = {
                physics: false
            };
            if(this.seed) {
                options = {
                    ...options,
                    layout: {
                        randomSeed: "Notch"
                    }
                }
            }

            new vis.Network(container, data, options);
        }
    }
}
</script>

<style>
.graph {
    cursor: grab;
    outline: 0 !important;
}
.graph:active {
    cursor: grabbing;
}

.graph * {
  outline: 0 !important;
}
</style>
