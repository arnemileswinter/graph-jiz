<template>
    <div class="modal" :data-open="open" @click="() => setOpen(false)">
        <div class="modal-content" @click.stop>
            <div class="modal-title">
                <slot name="title">
                    Title
                </slot>
            </div>
            <div class="modal-body">
                <slot/>
            </div>
            <div class="modal-footer">
                <slot name="footer">
                    Footer
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            open: {type: Boolean, required: false, default: false}
        },
        model: {
            prop: 'open',
            event: 'change'
        },
        methods: {
            setOpen(open) {
                this.$emit('change', open);
            }
        }
    }
</script>

<style>
.modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    z-index: 9999;

    background: rgba(0,0,0,0.5);

    opacity: 0;
    pointer-events: none;

    transition: opacity 200ms linear;
}
.modal[data-open="true"] {
    opacity: 100%;
    pointer-events: inherit;
}

.modal .modal-content {
    display: block;
    width: 50%;
    margin: 5em auto;

    background: #f7f7f7;
    border: 2px solid #2b7ce9;
}

.modal .modal-title{
    padding: 0.5em 1em;
    font-family: sans-serif;
    border-bottom: 1px solid #ddd;
}
.modal .modal-footer{
    padding: 0.5em 1em;
    font-family: sans-serif;
    border-top: 1px solid #ddd;
}
.modal .modal-body {
    padding: 0.5em 1em;
    min-height: 15em;
}

</style>
