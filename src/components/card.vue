<template>
    <div class="card" :id="id">
        <div class="card-header">
            <button @click="previous" :disabled="noPrevious()"><icon id="arrow-left" :button="true"></icon></button>
            <v-select ref="inputSelected" :options="options" v-model="selected" placeholder="Start typing..."></v-select>
            <button @click="next" :disabled="noNext()"><icon id="arrow-right" :button="true"></icon></button>
            <v-select v-if="this.selected && this.selected.novice" class="power-level" :options="powerLevels()" v-model="powerLevel"></v-select>
            <button class="remove-card" @click="$emit('dismiss', id)"><icon id="cross" :button="true"></icon></button>
        </div>

        <fieldset v-if="selected">
            <legend>
               <h2>{{ selected.name }}
                 <span v-if="selected.remark">({{ selected.remark }})</span>
                 <small>{{ selected.book }}</small>
               </h2>
            </legend>
            <div>
                <p v-if="selected.requirement">
                    <strong>Requirement:</strong> {{ selected.requirement }}
                </p>
                <p v-if="selected.tradition">
                    <strong>Tradition:</strong> {{ selected.tradition }}
                </p>
                <p v-if="selected.effect">
                    {{ selected.effect }}
                </p>
                <p v-if="selected.boons">
                    <strong>Boons:</strong> {{ selected.boons }}
                </p>
                <p v-if="selected.burdens">
                    <strong>Burdens:</strong> {{ selected.burdens }}
                </p>
                <p v-if="selected.options">
                    <strong>Options:</strong> {{ selected.options }}
                </p>
                <p v-if="selected.traits">
                    <strong>Traits:</strong> {{ selected.traits }}
                </p>
                <div v-if="selected.novice">
                    <div class="line" v-if="showNovice">
                        <strong>Novice:</strong>
                        <p v-html="emphasizeFirstWord(selected.novice)"></p>
                    </div>
                    <div class="line" v-if="showAdept">
                        <strong>Adept:</strong>
                        <p v-html="emphasizeFirstWord(selected.adept)"></p>
                    </div>
                    <div class="line" v-if="showMaster">
                        <strong>Master:</strong>
                        <p v-html="emphasizeFirstWord(selected.master)"></p>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script>
    import { scrollToTop } from '../helpers';
    import vSelect from 'vue-select';
    import Icon from './icon.vue';

    export default {
        props: [
            'id',
            'index',
            'options',
            'preSelected',
        ],

        data() {
            return {
                selected: null,
                powerLevel: null,
                remark: null,
            };
        },

        components: {
            vSelect,
            Icon,
        },

        methods: {
            emphasizeFirstWord(text) {
                let chunks = text.split('.');
                chunks[0] = '<em>' + chunks[0] + '</em>';
                return chunks.join('.');
            },

            previous() {
                let index = this.options.indexOf(this.selected);
                index--;
                this.selected = this.options[index];
            },

            next() {
                let index = this.options.indexOf(this.selected);
                index++;
                this.selected = this.options[index];
            },

            noPrevious() {
                if (this.selected) {
                    let index = this.options.indexOf(this.selected);
                    index--;

                    return !this.options[index];
                }

                return true;
            },

            noNext() {
                if (this.selected) {
                    let index = this.options.indexOf(this.selected);
                    index++;

                    return !this.options[index];
                }

                return false;
            },

            normalizeLevel(x) {
              return Math.max(['N','A','M'].indexOf(x), ['I','II','III'].indexOf(x), ['1','2','3'].indexOf(x)) + 1;
            },

            showLevel(i) {
              return !this.powerLevel || this.normalizeLevel(this.powerLevel) >= i;
            },

            isMonstrousTrait() {
              return this.selected && this.selected.type == 'Monstrous Trait';
            },

            powerLevels() {
              if (this.selected && this.selected.novice) {
                return this.isMonstrousTrait() ? ["I","II","III"] : ["N","A","M"];
              }
              return [];
            }
        },

        watch: {
            selected(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.$emit('change', newVal);
                }
            },
            powerLevel(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.$parent.cards[this.index].powerLevel = newVal;
                    this.$parent.persistCardsToURL();
                }
            },
        },

        created() {
            if (this.preSelected) {
                this.selected = this.preSelected;
                this.powerLevel = this.preSelected.powerLevel;
            }
        },

        computed: {
          showNovice() {
            return this.selected.novice && this.showLevel(1);
          },
          showAdept() {
            return this.selected.adept && this.showLevel(2);
          },
          showMaster() {
            return this.selected.master && this.showLevel(3);
          },
        },

        mounted() {
            if (!this.selected) {
                this.$refs.inputSelected.$refs.search.focus();
            }
        },
    };
</script>
