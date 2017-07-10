<template>
    <div>
        <sb-header @add="newCard"></sb-header>
        <div class="cards">
            <card
                v-for="card in cards"
                :id="card.id"
                :options="options"
                :pre-selected="card.selected"
                :key="card.id"
                @dismiss="remove"
            ></card>
        </div>
        <div class="panel">
            <p>Welcome to Symbook, the quick reference cyclopedia for Symbaroum traits, abilities, and more.</p>
            <p>All content is the property of Nya Järnringen AB and used with their permission.</p>
            <p>Press the <strong>plus</strong> button in the top right to add your first&mdash;and subsequent&mdash;cards.</p>
        </div>
        <footer>
            <p><strong>Credits:</strong> Symbook was created by <a href="mailto:frank@symbook.io">Frank Reding</a> <icon name="google" size="0.7rem" url="https://plus.google.com/+FrankReding"></icon> <icon name="twitter" size="0.7rem" url="https://twitter.com/Mottokrosh"></icon>.<br>Art design inspired by the fantastic work of Johan Nohr for the Symbaroum books.<br>Special thanks to <a href="https://plus.google.com/+SymbaroumTeam" target="_blank">Järnringen</a> for creating such a great game.</p>
        </footer>
    </div>
</template>

<script>
    import axios from 'axios';
    import MoveTo from 'moveto';
    import SbHeader from './sb-header.vue';
    import Card from './card.vue';
    import Icon from './icon.vue';

    const moveTo = new MoveTo();

    export default {
        components: {
            SbHeader, Card, Icon,
        },

        data() {
            return {
                cardModel: {
                    id: 1,
                    selected: null
                },
                lastId: 0,
                cards: [],
                options: [],
            };
        },

        methods: {
            newCard() {
                this.lastId++;
                let card = Object.assign({}, this.cardModel);
                card.id = this.lastId;
                this.cards.push(card);

                this.$nextTick(() => {
                    const cardEl = document.getElementById(card.id);
                    moveTo.move(cardEl);
                    cardEl.querySelector('input[name="search"]').focus();
                });
            },

            remove(id) {
                this.cards = this.cards.filter(card => {
                    return card.id !== id;
                });
            }
        },

        created() {
            axios.get('data/symbaroum.json')
                .then(response => {
                    this.options = response.data;
                })
            ;
        }
    };
</script>