import * as Vue from "./vue.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            imageFile: null,
            description: "",
            username: "",
        };
    },
    mounted() {
        fetch("/images.json")
            .then((res) => res.json())
            .then((res) => {
                this.images = res;
            });
    },
    methods: {
        handleSubmit(e) {
            e.preventDefault();
            // console.log(this.title, this.imageFile);

            const formData = new FormData();

            formData.append("title", this.title);
            formData.append("image", this.imageFile);
            formData.append("description", this.description);
            formData.append("username", this.username);

            fetch("/images.json", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((res) => {
                    this.images.unshift(res[0]);
                });
        },
        handleFileChange(e) {
            console.log("change file:", e.target);

            this.imageFile = e.target.files[0];
        },
    },
});

app.mount("main");
