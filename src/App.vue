<template>
    <div id="app">
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
</template>

<script>
    import TextArea from "./TextArea";
    import Graph from "./Graph";

    export default {
        components: {TextArea, Graph},
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

    #app {
        display: flex;
        height: 100vh;
        justify-content: left;
    }

    #app > * {
        min-height: 100%;
        width: 100%;
    }
</style>
