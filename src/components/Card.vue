<template>
	<div>
		<v-select v-model="selected" :options="options"></v-select>

		<div class="card">
			<h2>{{ ability.Trait }}</h2>
			<div>
				<p>Book: {{ ability.Book }}</p>
				<p>Requirement: {{ ability.Requirement }}</p>
				<p>Effect: {{ ability.Effect }}</p>
				<p>Novice: {{ ability.Novice }}</p>
				<p>Adept: {{ ability.Adept }}</p>
				<p>Master: {{ ability.Master }}</p>
			</div>
			<!-- <pre>{{ selected && selected.value }}</pre> -->
		</div>
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
						label: obj.Trait,
						value: obj,
					};
				});
			})
		;
	}
};
</script>