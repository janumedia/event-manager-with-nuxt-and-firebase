export default {
    data() {
        return {
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"]
        }
    },
    methods: {
        numFormat(number) {
            if(number === undefined) return ""
            if(typeof number === "string") number = Number(number)
            //https://stackoverflow.com/a/14428340/1578100
            return number.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')
        },
        formatDate(date, time) {
            let datetime
            if(time)
            {
                // safari not support new Date(YYYY-MM-DD) it should use YYYY/MM/DD otherwise return NaN
                // https://stackoverflow.com/a/4310986/1578100
                datetime = new Date(date.split("-").join("/") + " " + time)
            } else 
            {
                datetime = date
                time = date.getHours() + ":" + date.getMinutes()
            }
            return  datetime.getDate() + " " + this.monthNames[datetime.getMonth()] + " " + 
                    datetime.getFullYear() + " " + time
        },
        sortByClassName(data) {
            return data.sort((a, b) => {
                var dateA = a.className
                var dateB = b.className
                if(dateA < dateB) return -1
                if(dateA > dateB) return 1
                return 0
            })
        }
    }
}