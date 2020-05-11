<template>
  <div>
    <sb-header @add="newCard"></sb-header>
    <div class="cards">
      <card
        v-for="(card, index) in cards"
        :id="card.id"
        :options="options"
        :pre-selected="card.name ? card : null"
        :key="card.id"
        :data-empty="card.empty"
        @change="(newCard) => cardChange(newCard, index)"
        @dismiss="remove"
      ></card>
    </div>
    <div class="panel">
      <p>Welcome to Symbook, the quick reference cyclopedia for Symbaroum traits, abilities, and more.</p>
      <p>All content is the property of Free League/Fria Ligan and used with their permission.</p>
      <p>Press the <strong>plus</strong> button in the top right to add your first&mdash;and subsequent&mdash;cards. Bookmark URL to return to the same set. Use multiple tabs if you like, one per character.</p>
    </div>
    <footer>
      <p><strong>Credits:</strong> Symbook was created by <a href="mailto:shout@mottokrosh.com">Frank "Mottokrosh" Reding</a> (<a href="https://mottokrosh.com" rel="noopener" target="_blank">Games, Blog, Apps</a>) <social-icon name="twitter" size="0.7rem" url="https://twitter.com/Mottokrosh"></social-icon>.<br>Art design inspired by the fantastic work of Johan Nohr for the Symbaroum books.<br>Special thanks to <a href="https://frialigan.se/en/startpage/" rel="noopener" target="_blank">Free League</a> for creating such a great game.</p>
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
          id: null,
          empty: true,
        },
        cards: [],
        options: [],
      };
    },

    methods: {
      newCard() {
        let card = Object.assign({}, this.cardModel);
        this.cards.push(card);

        this.$nextTick(() => {
          const emptyCards = document.querySelectorAll('[data-empty="true"]');
          if (emptyCards) {
            scrollToTop(emptyCards[emptyCards.length-1]);
          }
        });
      },

      remove(id) {
        this.cards = this.cards.filter(card => {
          return card.id !== id;
        });
      },

      getCardIDsFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const cardIDs = urlParams.get('c') ? urlParams.get('c').split('-') : [];
        return cardIDs.map(id => Number(id));
      },

      setCardIDsIntoURL() {
        const ids = this.cards.filter(c => !!c.id).map(card => card.id).join('-');
        if (ids) {
          const urlParams = new URLSearchParams(`c=${ids}`);
          history.pushState(null, '', `/?${urlParams.toString()}`);
          return;
        }
        history.pushState(null, '', '/');
      },

      cardChange(newCard, index) {
        this.cards.splice(index, 1, newCard);
      },
    },

    watch: {
      cards() {
        this.setCardIDsIntoURL();
      },
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

          const cardIDs = this.getCardIDsFromURL();
          if (cardIDs) {
            this.cards = this.options.filter(opt => cardIDs.includes(opt.id));
          }
        })
      ;
    },
  };
</script>