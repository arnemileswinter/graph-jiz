<template>
<div class="dropdown-item" @click="$emit('click')">
    <slot/>
</div>
</template>

<style>
.dropdown-item {
    padding: 0.25em;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    font-family: sans-serif;

    font-size: 0.8em;
}
.dropdown-item:hover {
    background: #2b7ce9;
    color: #ddd;
}
</style>
