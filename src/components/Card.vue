<template>
	<div class="card">
		<h1>Hello, world!</h1>
		<v-select v-model="selected" :options="options"></v-select>
		<pre>{{ selected && selected.value }}</pre>
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