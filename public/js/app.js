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
        <div class="comments" v-for="item in comments"> <strong>{{item.username}}</strong>&nbsp &nbsp <font size=2>{{item.text}}</font></div>
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
                this.comments = res;
            })
            .catch((e) => console.log("there was an: ", e));
    },
    watch: {
        id: function (val) {
            this.fetchNew(val);
        },
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
                    this.comments.unshift(res);
                })
                .catch((e) => console.log("error en post: ", e));
            this.username = "";
            this.text = "";
        },
        fetchNew(val) {
            const url = "/comments/" + val;
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    this.comments = res;
                })
                .catch((e) => console.log("oops,", e));
        },
    },
};

const userDetail = {
    props: ["id"],
    data() {
        return { user: {}, isNext: false, isPrevious: false };
    },
    template: `
    
    <div v-if="id" class="user-detail">
    <div class="multicont">
            <div :class="{ isPrevious: isPrevious }" class='prev-next' @click="previousClick" > 
                <p>&lt</p>
            </div>
            <div class="minicont">
                <img :src= user.url>
                <h2>{{ user.title }}</h2>
                <p>{{ user.description }}</p>
                <p>Updated by {{ user.username }} {{ user.created_at }}</p>
            </div>
            <comments-comp  :id="id" ></comments-comp>
        
            <div :class="{ isNext: isNext }" class='prev-next' @click="nextClick"> 
            <p>&gt</p>
            </div>
        </div> 
            <button class="close-btn" @click="onCloseClick">Close</button>
        </div>
        `,
    methods: {
        onCloseClick() {
            this.$emit("close");
        },
        previousClick() {
            const prev = this.user.previous;

            this.$emit("upprev", prev);
        },
        nextClick() {
            const next = this.user.next;
            this.$emit("upnext", next);
        },
        fetchNew(val) {
            const url = "/image/" + val;
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    this.user = res;

                    if (this.user.previous == null) {
                        this.isPrevious = true;
                    } else {
                        this.isPrevious = false;
                    }

                    if (this.user.next == null) {
                        this.isNext = true;
                    } else {
                        this.isNext = false;
                    }
                })
                .catch((e) => console.log("oops,", e));
        },
    },
    components: {
        "comments-comp": commentsComp,
    },
    watch: {
        id: function (val) {
            this.fetchNew(val);
        },
    },
    mounted() {
        const url = "/image/" + this.id;
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                if (res.length > 1) {
                    this.onCloseClick();
                }
                this.user = res;
                if (this.user.previous == null) {
                    this.isPrevious = true;
                } else {
                    this.isPrevious = false;
                }
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
            selectedUser: parseInt(location.pathname.slice(1)),
            seen: true,
            modal: false,
        };
    },
    components: {
        "user-detail": userDetail,
    },
    mounted() {
        if (isNaN(this.selectedUser)) {
            this.modal = false;
        } else {
            this.modal = true;
        }

        window.addEventListener("popstate", () => {
            this.selectedUser = parseInt(location.pathname.slice(1));
            if (isNaN(this.selectedUser)) {
                this.modal = false;
            } else {
                this.modal = true;
            }
        });

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
                    (this.title = ""), (this.imageFile = null);
                    this.description = "";
                    this.username = "";
                });
        },
        onClose() {
            this.selectedUser = null;
            history.pushState({}, "", "/");
            this.modal = false;
        },
        handleFileChange(e) {
            this.imageFile = e.target.files[0];
        },
        selectedPic(usr) {
            this.selectedUser = usr;
            history.pushState({}, "", `/${this.selectedUser}`);
            this.modal = true;
        },
        moreImgs() {
            const url = "/more/" + this.images[this.images.length - 1].id;
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    if (res.length <= 1) {
                        this.seen = false;
                    }
                    res.forEach((element) => {
                        this.images.push(element);
                    });
                });
        },
        previous(results) {
            this.selectedUser = results;
            history.pushState({}, "", `/${this.selectedUser}`);
            this.modal = true;
        },
        next(results) {
            this.selectedUser = results;
            history.pushState({}, "", `/${this.selectedUser}`);
            this.modal = true;
        },
    },
});

app.mount("main");
