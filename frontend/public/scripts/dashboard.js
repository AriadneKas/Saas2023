

function forward() {
    const fileInput = document.getElementById('file-input');
    const radioButtons = document.getElementsByName('radio');
    const file = fileInput.files[0];
    let selectedValue;
    const formData = new FormData();
    formData.append('file', file);
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            selectedValue = radioButtons[i].value;
            break;
        }
    }
    formData.append('type', selectedValue);
    console.log('Selected:', selectedValue);
    console.log('FormData:', formData);
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
        .then(
            setTimeout(() => {
                window.location.reload()
            }),
            3000)
        .catch(err => console.log(err))
    // document.getElementById('csvform').reset()

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

function downloadChart(format, button) {
    console.log(format, button.getAttribute('data-chartId'))
    // Get the chartId from the button's data attribute
    var chartId = button.getAttribute('data-chartId');
    var type = button.getAttribute('data-type');
    console.log(type);
    // Create a download link element
    var token = getCookie('token');
    var link = document.createElement('a');
    link.href = `http://localhost/api/download/${type}/${format}/${chartId}/${token}`; // Replace with the actual download URL
    link.download = chartId + '.' + format; // Set the file name with the given format
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up the link element
    document.body.removeChild(link);
}

function deleteChart(button) {
    var chartId = button.getAttribute('data-chartId');
    var token = getCookie('token');
    fetch(`http://localhost/api/deleteChart/${chartId}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(location.reload()).catch(function (error) { console.log(error); });
}

function showImg(calling) {
    const modal = document.getElementById('imageModal');
    const image = document.getElementById('toShow');
    const src = calling.getAttribute('src');
    image.setAttribute('src', src);
    console.log(image.getAttribute('src'));
    $('#imageModal').modal('show');

}