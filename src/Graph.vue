<template>
    <div ref="graph" class="graph" v-once/>
</template>

<script>
import * as vis from "vis-network/standalone";
import labelToSvg from './labelToSvg';

export default {
    data() {
        return ({
            nodeData: [],
            network: null,
            nodePositions: {}
        })
    },
    props: {
        parsed: {
            type: Object,
            required: true
        }
    },
    watch: {
        parsed() {
            this.drawGraph();
        }
    },
    methods: {
        fetchGraphVizNodes() {
            return new vis.DataSet(this.parsed.nodes.map((node) => {
                const cachedPosition = this.nodePositions[node.name] || {};

                return ({
                    ...cachedPosition,
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
        },
        fetchGraphVizEdges() {
            return new vis.DataSet(this.parsed.connections.map(connection => {
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
        },
        cacheNodePosition(nodeName){
            const {x,y} = this.network.getPosition(nodeName);
            this.nodePositions[nodeName] = {x,y};
        },
        cacheNodePositions(){
            this.parsed.nodes.forEach(node => {
                this.cacheNodePosition(node.name);
            });
        },
        drawGraph() {
            const nodes = this.fetchGraphVizNodes();
            const edges = this.fetchGraphVizEdges();

            const data = {
                nodes,
                edges
            };

            const $el = this.$refs.graph;
            $el.innerHTML = '';

            let options = {
                physics: false
            };

            this.network = new vis.Network($el, data, options);
            this.network.on('dragEnd', (e) => {
                for(const nodeId of e.nodes) {
                    this.cacheNodePosition(nodeId);
                    this.$emit('nodePositionsChanged', this.nodePositions);
                }
            });

            this.cacheNodePositions();
            this.$emit('nodePositionsChanged', this.nodePositions);
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
