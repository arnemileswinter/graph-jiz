<template>
    <div class="app">
    <ribbon
        url="https://github.com/arnemileswinter/graph-jiz"
        text="Fork me on GitHub!"
    />
    <div class="container">
        <text-area
                @change="onMarkupChange"
                :hasErrored="hasErrored"
                :errorLine="errorLine"
                :errorCol="errorCol"
        >
        </text-area>
        <graph :parsed="parsed"/>
    </div>
    </div>
</template>

<script>
import TextArea from "./TextArea";
import Graph from "./Graph";
import Ribbon from "vue-ribbon";
import parse from "./parser/parser";

    export default {
        components: {TextArea, Graph, Ribbon},
        data() {
            return {
                parsed: {},
                hasErrored: false,
                errorLine: -1,
                errorCol: -1
            }
        },
        methods: {
            onMarkupChange(newMarkup) {
                this.hasErrored = false;
                this.markup = newMarkup;

                try {
                    this.parsed = parse(this.markup);
                    this.drawGraph();
                } catch(e) {
                    const message = "" + e.message;
                    if(message.startsWith("Syntax")) {
                        const firstErrorLine = message.split('\n')[0];
                        this.errorLine = parseInt(firstErrorLine.split('line ', 2)[1].split(' ', 2)[0]);
                        this.errorCol = parseInt(firstErrorLine.split('col ', 2)[1].split(':', 2)[0]);
                    }
                    this.hasErrored = true;
                }
            }
        }
    }
</script>

<style>
    html, body {
        padding: 0;
        margin: 0;
    }

    .container {
        display: flex;
        height: 100vh;
        justify-content: left;
    }

    .container > * {
        min-height: 100%;
        width: 100%;
    }
</style>
