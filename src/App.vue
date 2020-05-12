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
        <graph :markup="markup"
               @parseError="onParseError"
        />
    </div>
    </div>
</template>

<script>
    import TextArea from "./TextArea";
    import Graph from "./Graph";
    import Ribbon from "vue-ribbon";

    export default {
        components: {TextArea, Graph, Ribbon},
        data() {
            return {
                markup: '',
                hasErrored: false,
                errorLine: -1,
                errorCol: -1
            }
        },
        methods: {
            onMarkupChange(newMarkup) {
                this.hasErrored = false;
                this.markup = newMarkup;
            },
            onParseError(evt) {
                this.errorLine = evt.line;
                this.errorCol = evt.col;
                this.hasErrored = true;
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
