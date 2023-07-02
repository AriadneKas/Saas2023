

function forward() {

    const fileInput = document.getElementById('file-input');
    const selector = document.getElementById('selector');
    const text = document.getElementById('modal-text');
    const title = document.getElementById('modal-title');
    const image = document.getElementById('preview-image');
    const addBtn = document.getElementById('addPreview');
    const cancelBtn = document.getElementById('cancelPreview');

    const file = fileInput.files[0];
    let selectedValue = selector.value;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('type', selectedValue);

    fetch('/api/generateChart', {
        method: 'POST',
        body: formData
    })
        .then(async response => {
            console.log(response)
            if (response.ok) {
                let data = await response.json();
                console.log(data)
                addBtn.setAttribute('data-chart', data.imgId);
                cancelBtn.setAttribute('data-chart', data.imgId);
                addBtn.setAttribute('data-type', data.type);
                cancelBtn.setAttribute('data-type', data.type);
                image.setAttribute('src', data.preview)
                $('#preview-modal').modal('show');
            } else if (response.status === 400) {
                title.innerHTML = 'Oops! Something went wrong';
                text.innerHTML = `Seems you don't have enough quotas`
                $('#myModal').modal('show');
            } else if (response.status === 500) {
                title.innerHTML = 'Oops! Something went wrong';
                text.innerHTML = `Check the provided csv file and try again`
                $('#myModal').modal('show');
            }
        })
        .catch((err) => {
            console.log(err);
            title.innerHTML = 'Error!';
            text.innerHTML = `An error occurred `
            $('#myModal').modal('show');
        })
    // document.getElementById('csvform').reset()
}
function rejectChart() {
    const cancelPreview = document.getElementById('cancelPreview');
    const chartCSV = cancelPreview.getAttribute('data-chart');
    fetch(`/api/rejectChart/${chartCSV}`, {
        method: 'DELETE',
    })
}
function addChart() {
    const text = document.getElementById('modal-text');
    const title = document.getElementById('modal-title');
    const addBtn = document.getElementById('addPreview');
    const imgId = addBtn.getAttribute('data-chart');
    const type = addBtn.getAttribute('data-type');
    console.log(imgId, type)
    fetch(`/api/upload/${type}/${imgId}`, {
        method: 'POST',
    }).then(response => {
        if (response.ok) {
            console.log("Chart added successfully");
        } else {
            title.innerHTML = 'Error!';
            text.innerHTML = `An unexpected error has occurred`
            $('#myModal').modal('show');
        }
    })
        .catch((err) => {
            console.log(err);
            title.innerHTML = 'Error!';
            text.innerHTML = `An unexpected error has occurred`
            $('#myModal').modal('show');
        })

}
function getCookie(name) {
    var cookieString = document.cookie;
    var cookies = cookieString.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}
function checkQuotasAndSubmit() {
    const text = document.getElementById('modal-text');
    const title = document.getElementById('modal-title');
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length === 0) {
        window.alert('Please select a file to upload')
        return;
    }
    fetch('/api/checkQuotas', { method: 'GET' })
        .then(response => response.json())
        .then(response => {
            if (response.ok) {
                forward();
            } else {
                title.innerHTML = 'Failure!';
                text.innerHTML = `You don't have enough quotas to do this!`
                const modal = document.getElementById('myModal');
                $('#myModal').modal('show');
            }

        }).catch(err => {
            console.log(err);
            title.innerHTML = 'Error!';
            text.innerHTML = `You can't create your chart`
            $('#myModal').modal('show');
        })

}

function downloadTemplate() {
    const selector = document.getElementById('selector');
    const link = document.createElement('a');
    const template = 'http://localhost/public/templates/' + selector.value + '-template.csv';
    link.href = template;
    link.download = selector.value + '-template.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
