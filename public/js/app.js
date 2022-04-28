import * as Vue from './vue.js';


const app = Vue.createApp({
    data(){
        return {
            images: [],
            juan: 'hole'
        };
    },
    mounted(){
        fetch("/images.json")
            .then(res=>res.json())
            .then(res=> {
                console.log(res);
                this.images = res
                console.log(this.images);
            });
    },
    methods: {
        myFirstMethod: function(){
            console.log('ueeeena');
        },
        methodDos(arg){
            console.log('user clicked on: ', arg);
        }
    }
});

app.mount("main");
