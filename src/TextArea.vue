<template>
    <div class="text-area">
        <div class="right-spacer"></div>
    </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";

export default {
    props: {
        initialBoilerplate: {type:String, required: false, default: ''},
        hasErrored: {type: Boolean, required: true},
        errorLine: {type: Number, required: true},
        errorCol: {type: Number, required: true}
    },
    data() {
        return ({
            codeMirror: null,
            errorMarker: null
        });
    },
    methods: {
        onCodeMirrorChange() {
            this.$emit('change', this.codeMirror.doc.getValue());
        },
        updateErrorMarker() {
            if(this.errorMarker) {
                this.errorMarker.clear();
            }
            if(this.hasErrored) {
                this.errorMarker = this.codeMirror.doc.markText({
                    line: this.errorLine - 1,
                    ch: this.errorCol -1
                }, {
                    line: this.errorLine - 1,
                    ch: this.errorCol
                }, {
                    className: 'syntax'
                });
            }
        }
    },
    mounted() {
        const codeMirror = CodeMirror(this.$el, {
            lineNumbers: true
        });
        codeMirror.setSize("100%", "100%");
        codeMirror.on("change", this.onCodeMirrorChange);
        this.codeMirror = codeMirror;
        codeMirror.doc.setValue(this.initialBoilerplate);
    },
    watch: {
        errorLine() {
            this.updateErrorMarker();
        },
        errorCol() {
            this.updateErrorMarker();
        },
        hasErrored() {
            this.updateErrorMarker();
        }
    }
}
</script>

<style>

.text-area {
    display: flex;
    min-width: 30em;
    max-width: 80em;
    overflow-x: auto;
    flex-direction: row-reverse;
    cursor: text;
}

.text-area .right-spacer {
    min-width: 0.5em;
    min-height: 100%;
    background: #f7f7f7;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
}

.syntax {
    text-decoration-line: underline;
    text-decoration-style: wavy;
    text-decoration-color: red;
}
</style>
