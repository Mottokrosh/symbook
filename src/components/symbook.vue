<template>
  <div>
    <sb-header @add="newCard"></sb-header>
    <div class="cards">
      <card
        v-for="(card, index) in cards"
        :id="card.id"
        :index="index"
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

  function idAtLevel(item) {
    let [_, id, __, level] = /^(\d+)(\.([^-]+))?$/.exec(item);
    return { id: Number(id), level: level };
  }

  function powerAtLevel(item) {
    let [_, name, __, level] = /^([^(]+)(\(([^)]+)\))?$/.exec(item);
    return { name: normalizeName(name), level: level };
  }

  function normalizeName(name) {
    return name.toLowerCase().replaceAll(/\s|-/g, '').replaceAll(/é/g, 'e');
  }

  function isMonstrousTraitLevel(x) {
    return ["I","II","III"].includes(x);
  }

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
        return cardIDs.map(idAtLevel);
      },

      setCardIDsIntoURL() {
        const ids = this.cards.filter(c => !!c.id)
          .map(card => card.id + (card.powerLevel ? `.${card.powerLevel}` : '')).join('-');
        if (ids) {
          const urlParams = new URLSearchParams(`c=${ids}`);
          history.pushState(null, '', `/?${urlParams.toString()}`);
          return;
        }
        history.pushState(null, '', '/');
      },

      isNamesURL() {
        return new URLSearchParams(window.location.search).get('n');
      },

      getPowersAtLevelFromURL() {
        const urlParams = new URLSearchParams(window.location.search)
        return urlParams.get('n').split(/;|,/).map(powerAtLevel)
      },

      setPowersAtLevelIntoURL() {
        const names = this.cards.filter(c => !!c.id)
          .map(card => card.name + (card.powerLevel ? `(${card.powerLevel})` : '')).join(',');
        if (names) {
          history.pushState(null, '', `/?n=${names}`);
          return;
        }
        history.pushState(null, '', '/');
      },

      persistCardsToURL() {
        if (this.isNamesURL()) {
          this.setPowersAtLevelIntoURL();
        } else {
          this.setCardIDsIntoURL();
        }
      },

      cardChange(newCard, index) {
        this.cards.splice(index, 1, newCard);
      },
    },

    watch: {
      cards() {
        this.persistCardsToURL();
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

          if (this.isNamesURL()) {
            const powersAtLevel = this.getPowersAtLevelFromURL();
            if (powersAtLevel) {
              this.cards = powersAtLevel.map(power => {
                const card = this.options.find(opt => normalizeName(opt.name) == power.name
                  && (!isMonstrousTraitLevel() || opt.type == 'Monstrous Trait'));
                card.powerLevel = power.level;
                return card;
              });
            }
          } else {
            const idsAtLevel = this.getCardIDsFromURL();
            if (idsAtLevel) {
              this.cards = this.options.flatMap(opt => {
                const id = idsAtLevel.find(id => id.id == opt.id);
                if (id) {
                  opt.powerLevel = id.level;
                  return [opt];
                }
                return [];
              })
            }
          }
        })
      ;
    },
  };
</script>
