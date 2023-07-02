
const selectBtn = document.getElementById('selectBtn');
const fileInput = document.getElementById('file-input');
const filetag = document.getElementById('filetag');
const selector = document.getElementById('selector');
const form = document.getElementById('csvform');
const resetBtn = document.getElementById('resetBtn');
const resetProxy = document.getElementById('resetProxy');

resetProxy.addEventListener('click', () => {
    resetBtn.click();
});

selectBtn.addEventListener('click', () => {
    fileInput.click();
})

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        let name = fileInput.files[0].name;
        filetag.value = name;
    } else {
        filetag.value = null;
    }
});

const dropArea = document.getElementById('dropArea');

dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('dragleave', handleDragLeave);
dropArea.addEventListener('drop', handleDrop);

function handleDragOver(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = 'rgba( 0, 0, 0, 0.05)'
    dropArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = 'aliceblue'
    dropArea.classList.remove('dragover');
}



dropArea.addEventListener('click', () => {
    fileInput.click();
})

function handleDrop(event) {
    event.preventDefault();
    dropArea.style.backgroundColor = 'aliceblue'
    fileInput.files = event.dataTransfer.files;
    console.log(fileInput.files)
    filetag.value = fileInput.files[0].name;
}