document.addEventListener('DOMContentLoaded', function () {
    renderInput()
    loadFile()
})

const _basicMessage = `Перетащите сюда файл <br> или нажмите, чтобы выбрать`
let dropArea, dropAreaInput, invalidSizeClass = ''

//object for passing options
let options = {
    maxSizeMb: 1,
    artributes: ``
}

function renderInput(message = _basicMessage) {

    const div = document.querySelector('.fileLoader')

    if (document.querySelector('.my-form') !== null) {
        div.innerHTML = ''
    }

    let divHTML = `<form class="my-form">
                        <div class="drop-area ${invalidSizeClass}" id="drop-area">
                            <div class="drop-area__title" >${message}</div>
                            <input class='drop-area__input' type="file" name="input" 
                            id="drop-area__input" accept=".xlsx, .xls" ${options.artributes}>
                        </div>
                    </form>`
    div.insertAdjacentHTML('afterbegin', divHTML)
}

function loadFile() {

    dropArea = document.getElementById('drop-area')
    dropAreaInput = document.getElementById('drop-area__input')

    const events = ['dragenter', 'dragover', 'dragleave', 'drop']
    const enterOcerEvents = ['dragenter', 'dragover']
    const leaveDropEvents = ['dragleave', 'drop']

    events.forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    })

    enterOcerEvents.forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    leaveDropEvents.forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

    dropArea.addEventListener('drop', handleDrop, false)
    dropAreaInput.addEventListener('change', handleInput, false)

    function handleDrop(e) {

        let files = e.dataTransfer.files
        let file = files[0]

        validateType(file)

        let dropObj = new BindConstructor(dropArea, file)
    }

    function handleInput() {
        let file = document.getElementById('drop-area__input').files[0]
        validateType(file)
    }

}

function highlight() {
    dropArea.classList.add('highlight')
}

function unhighlight() {
    dropArea.classList.remove('highlight')
}

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function validateType(file) {

    let regExp = /\.(xlsx|xls|xlsm)$/i
    let fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
    let invalidTypeMessage = `Недопустимый тип файла "${fileExtension}", выберите другой <br> файл`

    regExp.test(file.name) ? validateSize(file) : renderInput(invalidTypeMessage)
}

function validateSize(file) {

    const bytesInMb = 1048576
    let fileSizeMb = file.size / bytesInMb
    let invalidSizeMessage = `Допустимый размер файла ${options.maxSizeMb} Мб, выберите <br> другой файл`
    invalidSizeClass = 'invalid-size'

    fileSizeMb < options.maxSizeMb ? parseFile(file) : renderInput(invalidSizeMessage, invalidSizeClass)
    invalidSizeClass = ''
}

function parseFile(file) {

    let reader = new FileReader()

    reader.onload = function (e) {

        let data = e.target.result
        let parsedFile
        let fileToUpload = XLSX.read(data, { type: 'binary' });

        fileToUpload.SheetNames.forEach(sheet => {
            parsedFile = XLSX.utils.sheet_to_row_object_array(fileToUpload.Sheets[sheet])
        })

        uploadFile(parsedFile)
        renderInput(`Файл - " ${file.name} "`)
    };

    reader.readAsBinaryString(file)
}

function uploadFile(parsedFile) {

    let url = 'http://193.243.158.230:4500/api/import'

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            'resultArray': parsedFile
        }),
        headers: {
            'Authorization': 'test-task',
            'Content-Type': 'application/json;charset=utf-8'
        }
    })

        .then((responce) => {
            console.log(responce)
        })
        .catch(() => {
            throw new Error('not ok')
        })
}

class BindConstructor {

    constructor(element, data) {
        this.data = data;
        this.element = element;
        element.value = data;
        element.addEventListener('change', this, false);
    }
}

BindConstructor.prototype.handleEvent = function (event) {
    switch (event.type) {
        case 'change': this.change(this.element.value);
    }
};

BindConstructor.prototype.change = function (value) {
    this.data = value;
    this.element.value = value;
};