import Vue from 'vue';
import SbHeader from './components/SbHeader.vue';
import Card from './components/Card.vue';

new Vue({
    el: '#app',

    components: {
        SbHeader, Card
    },

    data: {
        lastId: 1,
        cards: [
            {
                id: 1,
                selected: null
            }
        ]
    },

    methods: {
        newCard() {
            this.lastId++;
            this.cards.push({
                id: this.lastId,
                selected: null
            });
        },

        remove(id) {
            this.cards = this.cards.filter(card => {
                return card.id !== id;
            });
        }
    }
});