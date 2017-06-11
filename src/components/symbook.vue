<template>
    <div>
        <sb-header @add="newCard"></sb-header>
        <div class="cards">
            <card v-for="card in cards" :id="card.id" :pre-selected="card.selected" :key="card.id" @dismiss="remove"></card>
        </div>
        <div class="panel">
            <p>Welcome to Symbook, the quick reference cyclopedia for Symbaroum traits, abilities, and more.</p>
            <p>All content is the property of Nya Järnringen AB and used with their permission.</p>
            <p>Press the <strong>plus</strong> button in the top right to add your first&mdash;and subsequent&mdash;cards.</p>
        </div>
        <footer>
            <p>Credits: Symbook was created by Frank Reding. Art design inspired by the fantastic work of Johan Nohr for the Symbaroum books. Special thanks to Järnringen for creating such a great game.</p>
        </footer>
    </div>
</template>

<script>
    import SbHeader from './SbHeader.vue';
    import Card from './Card.vue';

    export default {
        components: {
            SbHeader, Card
        },

        data() {
            return {
                cardModel: {
                    id: 1,
                    selected: null
                },
                lastId: 1,
                cards: [],
            };
        },

        methods: {
            newCard() {
                this.lastId++;
                let card = Object.assign({}, this.cardModel);
                card.id = this.lastId++;
                this.cards.push(card);
            },

            remove(id) {
                this.cards = this.cards.filter(card => {
                    return card.id !== id;
                });
            }
        }
    };
</script>