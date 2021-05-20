document.addEventListener('DOMContentLoaded', function () {
    getQuantity()
})


function getQuantity() {

    let selects = document.querySelector('.selects')
    let input

    let result = {
        quantity: 0,
        type: ''
    }

    selects.addEventListener('click', function (e) {
        let svg

        if (e.target.tagName === 'path') {
            svg = e.target.closest('svg')
        }

        if (e.target.tagName === 'svg') {
            svg = e.target
        }

        if (svg.className.baseVal.includes('svg-btn-up')) {

            let parent1 = e.target.closest('button')
            let parent = parent1.closest('div')

            input = parent.previousElementSibling
            input.value++
            result.quantity = input.value
            result.type = input.id

            return result
        }

        if (svg.className.baseVal.includes('svg-btn-down')) {

            let parent1 = e.target.closest('button')
            let parent = parent1.closest('div')

            input = parent.previousElementSibling
            if (input.value > 0) {
                input.value--
            }

            result.quantity = input.value
            result.type = input.id

            return result
        } 
    })

}

document.querySelector('.calendarBtn').addEventListener('click', function () {
    picker.show()
})

