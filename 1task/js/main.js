let resultQuantity = {
    rooms: 0,
    adults: 0,
    kids: 0
}

document.addEventListener('DOMContentLoaded', function () {
    initCountQuantity()
})


function initCountQuantity() {
    let selects = document.querySelector('.selects')

    selects.addEventListener('click', function (e) {
        let svg

        if (e.target.tagName === 'path') {
            svg = e.target.closest('svg')
        }

        if (e.target.tagName === 'svg') {
            svg = e.target
        }

        svg && updateQuantity(svg, e)        
    })

}

function updateQuantity(svg, e) {
    let parent = e.target.closest('.select-wrapper__inner')
    let input = parent.getElementsByTagName('input')[0] 

    if (svg.className.baseVal.includes('svg-btn-up')) {
        input.value++
        resultQuantity[input.id] = input.value
    }

    if (svg.className.baseVal.includes('svg-btn-down')) {        
        if (input.value > 0) {
            input.value--
        }

        resultQuantity[input.id] = input.value
    } 
}

document.querySelector('.calendarBtn').addEventListener('click', function () {
    window.picker.show()
})

