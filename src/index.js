"use strict";

import Vue from "vue/dist/vue.esm"
import { Fzf, byLengthAsc } from "fzf"

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}

let timer = null;
let fzf = null;

let app = new Vue({
    el: "#app",
    data: {
        search: "",
        selected: 0,
        image_timeout: ["back.jpg"]
    },
    computed: {
        results: function() {
            if (this.search.length == 0 || fzf == null) {
                return [];
            }

            let found_cards = fzf.find(this.search).slice(0, 6);
            return found_cards.map(el => el.item);
        },
        image: function() {
            if (this.results.length == 0) {
                return ["back.jpg"];
            }

            return this.results[this.selected].image;
        }
    },
    methods: {
        key: function(e) {
            let code = e.key;
            if (code == "ArrowDown") {
                this.selected = this.selected == this.results.length - 1 ? 0 : this.selected + 1;
            } else if (code == "ArrowUp") {
                this.selected = this.selected == 0 ? this.results.length - 1 : this.selected - 1;
            } else if (code == "Enter" && this.results.length) {
                window.location.href = this.results[this.selected].uri;
            }
        }
    },
    watch: {
        search: function() {
            this.selected = 0;
        },
        image: function(val) {
            clearTimeout(timer);
            timer = setTimeout(() => {this.image_timeout = val;}, 100);
        }
    }
});

(async function() {
    let response = await fetch("cards.json");
    if (response.ok) {
        let data = await response.json();

        fzf = new Fzf(data, {
            selector: item => item.name,
            tiebreakers: [byLengthAsc]
        });

        document.getElementById("search").focus();
    }
})();