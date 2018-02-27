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
            <p><strong>Credits:</strong> Symbook was created by <a href="mailto:frank@symbook.io">Frank Reding</a> (<a href="https://mottokrosh.com" target="_blank">Blog, More Apps</a>) <social-icon name="google" size="0.7rem" url="https://plus.google.com/+FrankReding"></social-icon> <social-icon name="twitter" size="0.7rem" url="https://twitter.com/Mottokrosh"></social-icon>.<br>Art design inspired by the fantastic work of Johan Nohr for the Symbaroum books.<br>Special thanks to <a href="https://plus.google.com/+SymbaroumTeam" target="_blank">Järnringen</a> for creating such a great game.</p>
        </footer>
    </div>
</template>

<script>
    import axios from 'axios';
    import Headroom from 'headroom.js';
    import SbHeader from './sb-header.vue';
    import Card from './card.vue';
    import SocialIcon from './social-icon.vue';
    import { scrollToTop } from '../helpers';

    export default {
        components: {
            SbHeader, Card, SocialIcon,
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
                    scrollToTop(cardEl);
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
                    let options = [];

                    response.data.map((item) => {
                        item.label = item.type + ': ' + item.name + ' (' + item.book + ')';
                        options.push(item);
                    });

                    this.options = options;
                })
            ;
        },

        mounted() {
            // revealing/hiding header
            /*var headroom  = new Headroom(
                document.querySelector('#nav-bar'),
                { tolerance: 20 }
            );
            headroom.init();*/
        },
    };
</script>