<template>
    <header>
        <div>
            <img src="images/symbook.png">
            <small>Symbaroum Cyclopedia</small>
        </div>
        <nav>
            <ul>
                <li><button @click="$emit('add')" class="add-card"><span>+</span></button></li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'SbHeader'
};
</script>