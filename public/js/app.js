import * as Vue from "./vue.js";
// import  userDetail from "../../components/UserDetail.mjs";

const userDetail = {
    props: ["id"],
    data() {
        return { user: {} };
    },
    template: `
        <div class="user-detail">
            <img :src= user.url>
            <h2>{{ user.title }}</h2>
            <p>{{ user.description }}</p>
            <p>Updated by {{ user.username }} {{ user.created_at }}</p>
            <button @click="onCloseClick">Close</button>
        </div>
        `,
    methods: {
        onCloseClick() {
            this.$emit("close");
        },
    },

    mounted() {
        const url = "/image/" + this.id;

        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                this.user = res;
            })
            .catch((e) => console.log("oops,", e));
    },
};

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            imageFile: null,
            description: "",
            username: "",
            selectedUser: null,
        };
    },
    components: {
        "user-detail": userDetail,
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
        onClose() {
            this.selectedUser = null;
        },
        handleFileChange(e) {
            this.imageFile = e.target.files[0];
        },
        selectedPic(usr) {
            this.selectedUser = usr;
        },
    },
});

app.mount("main");
