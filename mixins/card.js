import cardDetail from "@/components/card-detail"
import cardAddOn from "@/components/card-add-on"
import utils from "@/mixins/utils"

export default {
    components: {
        cardDetail,
        cardAddOn
    },
    asyncData({env}) {
        return {
            tshirtSizes: env.tshirtSizes
        }
    },
    mixins: [utils],
    computed: {
        paid() {
            return this.total <= parseInt(this.totalPayment)
        },
        totalPaymentFormatted() {
            if(!this.totalPayment) return null
            return "IDR " + this.numFormat(this.totalPayment)
        },
        total() {
            let count = this.rates.tshirt
            count += this.donation * 1
            //count for extra tshirt
            count += this.totalTshirts * this.rates.extraTshirt
            if(!this.going) return count
            count += this.rates.consumption
            count += this.adult * this.rates.extraPerson
            count += this.child * this.rates.extraPerson
            return count
        },
        totalFormatted() {
            return "IDR " + this.numFormat(this.total)
        },
        totalTshirts() {
            let count = 0
            count += this.maleXXXL * 1
            count += this.maleXXL * 1
            count += this.maleXL * 1
            count += this.maleL * 1
            count += this.maleM * 1
            count += this.maleS * 1
            count += this.femaleXXXL * 1
            count += this.femaleXXL * 1
            count += this.femaleXL * 1
            count += this.femaleL * 1
            count += this.femaleM * 1
            count += this.femaleS * 1
            return count
        },
        extraTshirts() {
            var result = {}
            this.tshirtSizes.map(item => {
                if(this[item.value] && this[item.value] > 0) result[item.value] = {label: item.text, value: this[item.value]}
            })
            return result
        },
        selectedTshirtLabel() {
            if(!this.tshirt) return ""
            return this.tshirtSizes.find(item => item.value == this.tshirt).text
         }
    }
}