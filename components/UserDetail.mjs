
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

export default  userDetail ;