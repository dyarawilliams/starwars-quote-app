const update = document.querySelector('#update-btn')
const deleteBtn = document.querySelector('#delete-btn')
const messageDiv = document.querySelector('#message')


update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(response => {
        window.location.reload(true)
    })
})

deleteBtn.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vader'
        })
    })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
        if(response === 'No quote to delete'){
            messageDiv.textContent = 'No Darth Vader quote to delete'
        } else {
            window.location.reload(true)
        }
    })
    .catch(error => console.error(error))
})