<template>
    <div class="graph-tool-bar">
        <img class="logo" src="./graphjiz.svg"/>
        <Dropdown title="Export..." v-model="exportDropDownOpen">
            <dropdown-item @click="exportTikZ">
                LaTeX/TikZ
            </dropdown-item>
        </Dropdown>

        <modal v-model="textExportModalOpen">
            <template slot="title">
                {{textExportModalTitle}}
            </template>
            <div class="text-export-modal-content">
                <pre class="text-export-modal-content-editable"
                    contenteditable="true"
                    @cut.prevent
                    @paste.prevent
                    @keydown="(e) => e.metaKey"
                >{{textExportModalContent}}</pre>
            </div>
            <template slot="footer">
                <div style="display: flex; justify-content: space-between">
                    <common-button value="Close" @click="textExportModalOpen = false"/>
                    <common-button value="Close & Copy to Clipboard" @click="() => {copyToClipboard(textExportModalContent); this.textExportModalOpen = false}"/>
                </div>
            </template>
        </modal>
    </div>
</template>

<script>
import Dropdown from "./components/Dropdown";
import DropdownItem from "./components/DropdownItem";
import exportToTikZ from "./tikzExport";
import Modal from "./components/Modal";
import CommonButton from "./components/CommonButton";
import copy from "copy-to-clipboard";

export default {
    components: {Modal, Dropdown, DropdownItem, CommonButton},
    props: {
        parsed: {
            type: Object,
            required: true
        },
        nodePositions: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            exportDropDownOpen: false,
            textExportModalOpen: false,
            textExportModalContent: '',
            textExportModalTitle: ''
        }
    },
    methods: {
        exportTikZ() {
            this.textExportModalTitle = "Export to LaTeX/TikZ";
            this.textExportModalContent = exportToTikZ(this.parsed,this.nodePositions);
            this.textExportModalOpen = true;
            this.exportDropDownOpen = false;
        },
        copyToClipboard(string) {
            copy(string, {format:'text/plain'})
        }
    }
}
</script>
<style>
.graph-tool-bar {
    border: 1px solid #ddd;
    border-left: none;
    background: #f7f7f7;
    padding: 0.25em;

    display: flex;

}
.graph-tool-bar .logo {
    display: inline-block;
    height: 1.5em;
    margin-right: 0.5em;
}

.text-export-modal-content-editable {
    border: 1px solid #ddd;
    margin: 1px;
    font-family: monospace;
}
.text-export-modal-content-editable:active,
.text-export-modal-content-editable:focus{
    margin: 0;
    border: 2px solid #2b7ce9;
    outline: 0;
}
</style>
