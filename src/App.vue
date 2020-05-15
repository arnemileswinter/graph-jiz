<template>
    <div class="app">
        <ribbon
                url="https://github.com/arnemileswinter/graph-jiz"
                text="Fork me on GitHub!"
        />
        <ToolBar
                :parsed="parsed"
                :nodePositions="nodePositions"
                ref="toolbar"
        />
        <div class="container" :style="{height: containerHeight}">
            <text-area
                    class="text-area"
                    @change="onMarkupChange"
                    :initial-boilerplate="introBoilerplate"
                    :hasErrored="hasErrored"
                    :errorLine="errorLine"
                    :errorCol="errorCol"
            >
            </text-area>
            <graph
                    class="graph"
                    :parsed="parsed"
                    @nodePositionsChanged="onNodePositionsChanged"
            />
        </div>
    </div>
</template>

<script>
    import TextArea from "./TextArea";
    import Graph from "./Graph";
    import Ribbon from "vue-ribbon";
    import parse from "./parser/parser";
    import ToolBar from "./ToolBar";
    import introBoilerplate from "./intro-boilerplate.txt";

    export default {
        components: {ToolBar, TextArea, Graph, Ribbon},
        data() {
            return {
                introBoilerplate,
                parsed: {},
                hasErrored: false,
                errorLine: -1,
                errorCol: -1,
                nodePositions: {},
                containerHeight: '100vh'
            }
        },
        methods: {
            onMarkupChange(newMarkup) {
                this.hasErrored = false;
                this.markup = newMarkup;

                try {
                    this.parsed = parse(this.markup);
                    this.drawGraph();
                } catch (e) {
                    const message = "" + e.message;
                    if (message.startsWith("Syntax")) {
                        const firstErrorLine = message.split('\n')[0];
                        this.errorLine = parseInt(firstErrorLine.split('line ', 2)[1].split(' ', 2)[0]);
                        this.errorCol = parseInt(firstErrorLine.split('col ', 2)[1].split(':', 2)[0]);
                    }
                    this.hasErrored = true;
                }
            },
            onNodePositionsChanged(nodePositions) {
                this.nodePositions = nodePositions;
            },
            updateContainerHeight() {
                const pageHeight = document.body.clientHeight;
                const toolbarHeight = this.$refs.toolbar.$el.clientHeight;
                this.containerHeight = (pageHeight - toolbarHeight) + 'px';
            }
        },
        mounted() {
            this.updateContainerHeight();
            this.onMarkupChange(introBoilerplate);
        }
    }
</script>

<style>
html, body {
    padding: 0;
    margin: 0;
    overflow-y: hidden;
}

.app {
    min-height: 100vh;
}

.app .container {
    display: flex;
 }

.app .container .graph,
.app .container .text-area {
    min-height: 100%;
    min-width: 50%;
}
</style>
