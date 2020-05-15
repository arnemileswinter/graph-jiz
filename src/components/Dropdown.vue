<template>
    <div class="drop-down"
         ref="dropDown"
         :data-open="isOpen">
        <common-button
            @click="openDropdown"
            :value="title"
        />
        <div v-if="isOpen"
             class="drop-down-menu"
             ref="dropdownMenu"
             @click.stop
        >
            <slot/>
        </div>
    </div>
</template>

<script>
import CommonButton from "./CommonButton";

export default {
    components: {
        CommonButton
    },
    model: {
      prop: 'isOpen',
      event: 'change'
    },
    props: {
        title: {
            type: String,
            required: true
        },
        isOpen: {
            type:Boolean,
            required: false,
            default: false
        }
    },
    methods: {
        setOpen(open) {
            this.$emit('change', open);
        },
        openDropdown() {
            const clickListener = ({target}) => {
                if(!this.$refs.dropDown.contains(target)) {
                    this.setOpen(false);
                    document.removeEventListener('click', clickListener);
                }
            };
            document.addEventListener('click', clickListener);

            this.setOpen(true);
        }
    }
}
</script>

<style>
.drop-down {
    display: inline-block;
}
.drop-down .drop-down-menu {
    position: fixed;
    background: white;
    border: 1px solid #ddd;
    z-index: 999;
}
</style>
