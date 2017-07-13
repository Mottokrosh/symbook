<template>
    <div class="card" :id="id">
        <div class="card-header">
            <div class="search">
                <input type="search" name="search" v-model="search" @focus="showResults" @blur="hideResults">
                <div class="results" v-show="active">
                    <ul>
                        <li v-for="item in filteredOptions" @click="select(item)" tabindex="0">
                            {{ item.type }}: {{ item.name }} ({{ item.book }})
                        </li>
                    </ul>
                </div>
            </div>
            <button class="remove-card" @click="$emit('dismiss', id)"><span>&times;</span></button>
        </div>

        <fieldset v-if="selected">
            <legend>
                <h2>{{ selected.name }} <small>{{ selected.book }}</small></h2>
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
                    <div class="line" v-if="selected.novice">
                        <strong>Novice:</strong>
                        <p v-html="emphasizeFirstWord(selected.novice)"></p>
                    </div>
                    <div class="line" v-if="selected.adept">
                        <strong>Adept:</strong>
                        <p v-html="emphasizeFirstWord(selected.adept)"></p>
                    </div>
                    <div class="line" v-if="selected.master">
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

    export default {
        props: [
            'id',
            'options'
        ],

        data() {
            return {
                search: null,
                selected: null,
                active: false,
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

                    return item.name.match(regex);
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
                scrollToTop(document.getElementById(this.id));
            },

            hideResults() {
                this.active = false;
            },

            select(item) {
                this.selected = item;
                this.search = null;
                this.hideResults();
            },
        },
    };
</script>