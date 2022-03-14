<template>
    <main>
        <div class="card-area">
            <div class="card-container" v-for="i in image_timeout">
                <img class="card" :src="i">
            </div>
        </div>
        <div class="search">
            <input 
                id="search" class="input" type="search" autocomplete="off" placeholder="Search"
                :value="search" @input="input" @keydown="key"
            >
            <div class="box" v-if="search.length">
                <a class="suggestion" v-for="(r,i) in results" :href="r.uri" :class="{ active: selected == i }" >{{ r.name }}</a>
            </div>
        </div>
    </main>
</template>

<script>
    import { Fzf, byLengthAsc } from "fzf";
    let cards = new URL("cards.dat", import.meta.url);
    let back = new URL("back.jpg", import.meta.url);

    let timer = null;

    export default {
        data() {
            return {
                fzf: null,
                search: "",
                selected: 0,
                image_timeout: [back]
            };
        },
        computed: {
            results() {
                if (this.search.length == 0 || this.fzf == null) {
                    return [];
                }

                console.log(this.search);
                let finder = this.search.length <= 3 ? this.fzf.fast : this.fzf.default;
                let found_cards = finder.find(this.search);
                return found_cards.map(el => el.item);
            },
            image() {
                if (this.results.length == 0) {
                    return [back];
                }

                return this.results[this.selected].image;
            }
        },
        methods: {
            key(e) {
                let code = e.key;
                if (code == "ArrowDown") {
                    e.preventDefault();
                    this.selected = this.selected == this.results.length - 1 ? 0 : this.selected + 1;
                } else if (code == "ArrowUp") {
                    e.preventDefault();
                    this.selected = this.selected == 0 ? this.results.length - 1 : this.selected - 1;
                } else if (code == "Enter" && this.results.length) {
                    window.location.href = this.results[this.selected].uri;
                }
            },
            input(e) {
                this.search = e.target.value;
                this.selected = 0;
            }
        },
        watch: {
            image: function(val) {
                clearTimeout(timer);
                timer = setTimeout(() => {this.image_timeout = val;}, 100);
            }
        },
        async created() {
            let response = await fetch(cards);
            if (response.ok) {
                let data = await response.json();
                this.fzf = {
                    default: new Fzf(data, {
                        selector: item => item.name,
                        tiebreakers: [byLengthAsc],
                        limit: 6,
                        casing: "case-insensitive"
                    }),
                    fast: new Fzf(data, {
                        selector: item => item.name,
                        tiebreakers: [byLengthAsc],
                        limit: 6,
                        casing: "case-insensitive",
                        fuzzy: "v1"
                    })
                };

                document.getElementById("search").focus();
            }
        }
    };
</script>

<style src="./app.css"></style>