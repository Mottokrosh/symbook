<template>
    <div class="card">
        <div class="card-header">
            <v-select v-model="selected" :options="options"></v-select>

            <button class="remove-card" @click="$emit('dismiss', id)">&times;</button>
        </div>

        <fieldset v-if="selected">
            <legend>
                <h2>{{ ability.Trait }} <small>{{ ability.Book }}</small></h2>
            </legend>
            <div>
                <p v-if="ability.Requirement">
                    <strong>Requirement:</strong> {{ ability.Requirement }}
                </p>
                <p v-if="ability.Tradition">
                    <strong>Tradition:</strong> {{ ability.Tradition }}
                </p>
                <p v-if="ability.Effect">
                    {{ ability.Effect }}
                </p>
                <div v-if="ability.Novice">
                    <div class="line" v-if="ability.Novice">
                        <strong>Novice:</strong>
                        <p v-html="emphasizeFirstWord(ability.Novice)"></p>
                    </div>
                    <div class="line" v-if="ability.Adept">
                        <strong>Adept:</strong>
                        <p v-html="emphasizeFirstWord(ability.Adept)"></p>
                    </div>
                    <div class="line" v-if="ability.Master">
                        <strong>Master:</strong>
                        <p v-html="emphasizeFirstWord(ability.Master)"></p>
                    </div>
                </div>
            </div>
        </fieldset>
    </div>
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select';

export default {
    components: { vSelect },

    props: ['id', 'preSelected'],

    data() {
        return {
            selected: this.preSelected,
            options: [],
        }
    },

    computed: {
        ability() {
            return this.selected ? this.selected.value : {};
        }
    },

    created() {
        axios.get('data/symbaroum.json')
            .then(response => {
                let traits = Object.keys(response.data.Traits).map(key => {
                    let obj = response.data.Traits[key];
                    obj.Type = 'Trait';

                    return {
                        label: 'Trait: ' + obj.Trait + ' (' + obj.Book + ')',
                        value: obj,
                    };
                });

                let abilities = Object.keys(response.data.Abilities).map(key => {
                    let obj = response.data.Abilities[key];
                    obj.Type = 'Ability';

                    return {
                        label: 'Ability: ' + obj.Trait + ' (' + obj.Book + ')',
                        value: obj,
                    };
                });

                let powers = Object.keys(response.data['Mystical Powers']).map(key => {
                    let obj = response.data['Mystical Powers'][key];
                    obj.Type = 'Mystical Power';
                    obj.Trait = obj['Mystical Powers'].trim();

                    return {
                        label: 'Mystical Power: ' + obj.Trait + ' (' + obj.Book + ')',
                        value: obj,
                    };
                });

                this.options = traits.concat(abilities, powers);
            })
        ;
    },

    methods: {
        emphasizeFirstWord(text) {
            let chunks = text.split('.');
            chunks[0] = '<em>' + chunks[0] + '</em>';
            return chunks.join('.');
        }
    }
};
</script>