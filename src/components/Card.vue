<template>
    <div class="card">
        <v-select v-model="selected" :options="options"></v-select>

        <fieldset v-if="selected">
            <legend>
                <h2>{{ ability.Trait }} <small>{{ ability.Book }}</small></h2>
            </legend>
            <div>
                <p v-if="ability.Requirement">
                    <strong>Requirement:</strong> {{ ability.Requirement }}
                </p>
                <p v-if="ability.Effect">
                    <strong>Effect:</strong> {{ ability.Effect }}
                </p>
                <p v-if="ability.Novice">
                    <strong>Novice:</strong> {{ ability.Novice }}
                </p>
                <p v-if="ability.Adept">
                    <strong>Adept:</strong> {{ ability.Adept }}
                </p>
                <p v-if="ability.Master">
                    <strong>Master:</strong> {{ ability.Master }}
                </p>
            </div>
        </fieldset>
    </div>
</template>

<script>
import axios from 'axios';
import vSelect from 'vue-select';

export default {
    components: { vSelect },

    data() {
        return {
            selected: null,
            options: [],
        }
    },

    computed: {
        ability() {
            return this.selected ? this.selected.value : {};
        }
    },

    created() {
        axios.get('data.json')
            .then(response => {
                this.options = Object.keys(response.data.Abilities).map(key => {
                    let obj = response.data.Abilities[key];

                    return {
                        label: obj.Trait + ' (' + obj.Book + ')',
                        value: obj,
                    };
                });
            })
        ;
    }
};
</script>