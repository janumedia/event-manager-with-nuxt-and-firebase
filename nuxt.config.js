module.exports = {
    head: {
        title: "Event Calendar Manager",
        titleTemplate: "%s - Event Manager",
        meta: [
            { charset: "utf-8"},
            { name: "viewport", content: "width=device-width, initial-scale=1"},
            { hid: "description", name: "description", content: "Event Manager with Nuxt JS and Firebase"}
        ],
        link: [
            { rel: "faveicon", type: "image/x-icon", href: "faveicon.ico" },
            { rel: "stylesheet", href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" },
            { rel: "stylesheet", href: "https://unpkg.com/vuetify/dist/vuetify.min.css" }
        ]
    },
    loading: {
        color: "#E7E2DA"
    },
    plugins: [
        "~/plugins/firebase-plugin",
        "~/plugins/vuetify",
        "~/plugins/babel-polyfill"
    ],
    build: {
        filenames: {
            app: '[name].[chunkhash].js'
        },
        vendor: [
            "firebase",
            "vuetify"
        ]/*,
        analyze: {
            analyzerMode: "static"
        }*/
    },
    env: {
        classList: ["F3", "Avengers", "X-Force", "Teen Titan", "Justice League"],
        rates: {
            tshirt: 175000,
            consumption: 75000,
            extraTshirt: 75000,
            extraPerson: 75000,
            room: 300000
        },
        tshirtSizes: [
            { text: "XXXL male", value: "maleXXXL"},
            { text: "XXL male", value: "maleXXL"},
            { text: "XL male", value: "maleXL"},
            { text: "L male", value: "maleL"},
            { text: "M male", value: "maleM"},
            { text: "S male", value: "maleS"},
            { text: "XXXL female", value: "femaleXXXL"},
            { text: "XXL female", value: "femaleXXL"},
            { text: "XL female", value: "femaleXL"},
            { text: "L female", value: "femaleL"},
            { text: "M female", value: "femaleM"},
            { text: "S female", value: "femaleS"}
        ],
        sponsorship: {
            platinumMinLimit: 10000000,
            goldMinLimit: 5000000,
            silverMinLimit: 2500000,
            bronzeMinLimit: 1500000
        },
        redirect : {
            toEvent: "/event"
        }
    }
}