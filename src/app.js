import Vue from 'vue';
import SbHeader from './components/SbHeader.vue';
import Card from './components/Card.vue';

new Vue({
	el: '#app',

	components: {
		SbHeader, Card
	},

	data: {
		numberOfCards: 1
	}
});