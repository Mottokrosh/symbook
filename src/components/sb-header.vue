<template>
    <header>
        <div>
            <img src="images/symbook.png">
            <small>Symbaroum Cyclopedia</small>
        </div>
        <nav id="nav-bar">
            <ul>
                <li><button @click="$emit('add')" class="add-card"><icon id="plus" :button="true"></icon></button></li>
            </ul>
        </nav>
    </header>
</template>

<script>
    import Icon from './icon.vue';

    export default {
        name: 'SbHeader',

        components: {
            Icon,
        },
    };
</script>