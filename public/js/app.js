import * as Vue from "./vue.js";
// import  userDetail from "../../components/UserDetail.mjs";

//COMMENTS COMPONENT
const commentsComp = {
    props: ["id"],
    template: `
        <div class="comment-container">
        <form method="post">
            <input v-model="text" name="text" placeholder="comment" />
            <input  v-model="username" name="username" placeholder="username" />
            <button id="submit-comment" @click="addComment">submit</button>
        </form>
        <div class="comments" v-for="item in comments">{{item.text}} | {{item.username}}</div>
        </div>
    `,
    data() {
        return {
            comments: [],
            username: "",
            text: "",
        };
    },
    mounted() {
        const url = "/comments/" + this.id;
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                // res.forEach((item) => {
                //     this.comments.push(item);
                // });
                this.comments = res;
            })
            .catch((e) => console.log("there was an: ", e));
    },
    methods: {
        addComment(e) {
            e.preventDefault();

            fetch("/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: this.text,
                    username: this.username,
                    image_id: this.id,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    this.comments.unshift(res[0]);
                })
                .catch((e) => console.log("error en post: ", e));
        },
    },
};

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
           
            <comments-comp v-if="id" :id="id" ></comments-comp>
            
            <button @click="onCloseClick">Close</button>
        </div>
        `,
    methods: {
        onCloseClick() {
            this.$emit("close");
        },
    },
    components: {
        "comments-comp": commentsComp,
    },

    mounted() {
        const url = "/image/" + this.id;
        // console.log('id of selected: ', this.id);
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
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
            seen: true,
            modal: false
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
            this.modal= false
        },
        handleFileChange(e) {
            this.imageFile = e.target.files[0];
        },
        selectedPic(usr) {
            this.selectedUser = usr;
            this.modal= true
        },
        moreImgs() {
            // console.log('stuf', this.images[this.images.length-1].id);
            const url = "/more/" + this.images[this.images.length - 1].id;
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    if (res.length <= 1) {
                        this.seen = false;
                    }
                    res.forEach((element) => {
                        this.images.push(element);
                    });
                });
        },
    },
});

app.mount("main");
