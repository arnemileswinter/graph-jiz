<template>
    <input class="common-button"
           type="button"
           v-bind="$attrs"
           v-on="$listeners"
    />
</template>

<style>
.common-button {
    background: white;
    border: 1px solid #ddd;
    cursor: pointer;
    margin: 1px;
}
.common-button:focus,
.common-button:active {
    border: 2px solid #2b7ce9;
    margin: 0px;
    outline: 0;
}
.common-button::-moz-focus-inner {
    border: 0;
}
</style>
