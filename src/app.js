import Vue from 'vue';
import Symbook from './components/symbook.vue';

var app = {
    isWebView() {
    	return document.location.protocol === 'file:';
    },

    initialize() {
    	if (this.isWebView()) {
    		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    	} else {
			this.onDeviceReady();
    	}
    },

    onDeviceReady: function() {
    	new Vue({
    	    el: '#app',

    	    components: {
    	        Symbook,
    	    },
    	});
    },
};

app.initialize();
