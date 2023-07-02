const btn100 = document.getElementById('btn-100');
const btn25 = document.getElementById('btn-25');
const btn5 = document.getElementById('btn-5');
const modal = document.getElementById('myModal');


function buyquotas(number) {
    const text = document.getElementById('modal-text');
    const title = document.getElementById('modal-title');
    fetch(`/api/buyquotas/${number}`, {
        method: 'PUT'
    }).then(response => response.json())
    .then(data => {
        title.innerHTML = 'Success!';
        text.innerHTML = `${number} quotas were successfully added to your account. Now you have ${data.quotas} in total!`

        $('#myModal').modal('show');
    })
    .catch(err => {
        title.innerHTML = 'Error';
        text.innerHTML = `Error: ${err}`;
        modal.modal('show');
    })
}

btn100.addEventListener('click', () => {
    buyquotas(100);
});

btn25.addEventListener('click', () => {
    buyquotas(25);
});

btn5.addEventListener('click', () => {
    buyquotas(5);
});