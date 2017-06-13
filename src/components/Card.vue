<template>
    <div class="card">
        <div class="card-header">
            <div class="search">
                <input type="search" name="search" v-model="search" @focus="showResults">
                <div class="results" v-show="active">
                    <ul>
                        <li v-for="item in filteredOptions" @click="select(item)" tabindex="0">
                            {{ item.Type }}: {{ item.Name }} ({{ item.Book }})
                        </li>
                    </ul>
                </div>
            </div>
            <button class="remove-card" @click="$emit('dismiss', id)">&times;</button>
        </div>

        <fieldset v-if="selected">
            <legend>
                <h2>{{ selected.Name }} <small>{{ selected.Book }}</small></h2>
            </legend>
            <div>
                <p v-if="selected.Requirement">
                    <strong>Requirement:</strong> {{ selected.Requirement }}
                </p>
                <p v-if="selected.Tradition">
                    <strong>Tradition:</strong> {{ selected.Tradition }}
                </p>
                <p v-if="selected.Effect">
                    {{ selected.Effect }}
                </p>
                <div v-if="selected.Novice">
                    <div class="line" v-if="selected.Novice">
                        <strong>Novice:</strong>
                        <p v-html="emphasizeFirstWord(selected.Novice)"></p>
                    </div>
                    <div class="line" v-if="selected.Adept">
                        <strong>Adept:</strong>
                        <p v-html="emphasizeFirstWord(selected.Adept)"></p>
                    </div>
                    <div class="line" v-if="selected.Master">
                        <strong>Master:</strong>
                        <p v-html="emphasizeFirstWord(selected.Master)"></p>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['id'],

    data() {
        return {
            search: null,
            selected: null,
            active: false,
            options: [],
        };
    },

    computed: {
        filteredOptions() {
            if (!this.options.length) {
                return;
            }

            if (!this.search) {
                return this.options;
            }

            return this.options.filter(item => {
                const regex = new RegExp(this.search, 'i');

                return item.Name.match(regex);
            });
        }
    },

    methods: {
        emphasizeFirstWord(text) {
            let chunks = text.split('.');
            chunks[0] = '<em>' + chunks[0] + '</em>';
            return chunks.join('.');
        },

        showResults() {
            this.active = true;
        },

        hideResults() {
            this.$nextTick(() => {
                this.active = false;
            });
        },

        select(item) {
            this.selected = item;
            this.search = null;
            this.hideResults();
        },
    },

    created() {
        axios.get('data/symbaroum.json')
            .then(response => {
                let traits = Object.keys(response.data.Traits).map(key => {
                    let obj = response.data.Traits[key];
                    obj.Type = 'Trait';
                    obj.Name = obj.Trait;

                    return obj;
                });

                let abilities = Object.keys(response.data.Abilities).map(key => {
                    let obj = response.data.Abilities[key];
                    obj.Type = 'Ability';
                    obj.Name = obj.Trait;

                    return obj;
                });

                let powers = Object.keys(response.data['Mystical Powers']).map(key => {
                    let obj = response.data['Mystical Powers'][key];
                    obj.Type = 'Mystical Power';
                    obj.Name = obj.Trait = obj['Mystical Powers'].trim();

                    return obj;
                });

                let boons = Object.keys(response.data.Boons).map(key => {
                    let obj = response.data.Boons[key];
                    obj.Type = 'Boon';
                    obj.Name = obj.Trait;

                    return obj;
                });

                let burdens = Object.keys(response.data.Burdens).map(key => {
                    let obj = response.data.Burdens[key];
                    obj.Type = 'Burden';
                    obj.Name = obj.Trait;

                    return obj;
                });

                let rituals = Object.keys(response.data.Rituals).map(key => {
                    let obj = response.data.Rituals[key];
                    obj.Type = 'Ritual';
                    obj.Name = obj.Ritual;

                    return obj;
                });

                let monstrousTraits = Object.keys(response.data['Monstrous Traits']).map(key => {
                    let obj = response.data['Monstrous Traits'][key];
                    obj.Type = 'Monstrous Trait';

                    return obj;
                });

                this.options = abilities.concat(boons, burdens, monstrousTraits, powers, rituals, traits);
            })
        ;
    },
};
</script>