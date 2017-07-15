<template>
    <svg :class="classes">
        <use :xlink:href="iconId"></use>
    </svg>
</template>

<script>
    export default {
        props: {
            id: String,
            button: Boolean,
        },

        computed: {
            iconId() {
                return '#icon-' + this.id;
            },

            classes() {
                return 'icon icon-' + this.id + ( this.button ? ' icon-button' : '' );
            },
        },
    };
</script>