document.addEventListener("DOMContentLoaded", async function () {

    let producerList = document.getElementById('producer_Messages');
    let consumerList = document.getElementById('consumer_Messages');
    let consumerListItems = []

    document.querySelector('#button_send').addEventListener('click', () => {
        let input = document.getElementById('producer_Input');
        let label = document.getElementById('producer_Label');
        let message = input.value;

        if (message == "") {
            return
        }

        fetch('http://localhost:5000/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'message': message
            })
        })
            .then((res) => {
                producerList.insertAdjacentHTML('beforeend', `<li class="collection-item center">${message}</li>`)
            })
            .catch((err) => console.log(err))

        input.value = "";
        input.style.borderBottom = "1px solid #9e9e9e"
        input.style.boxShadow = "0 0 0 0 #9e9e9e"
        label.classList.remove("active")
    })

    oboe({
        url: 'http://localhost:5000/readMessage',
        headers: {
            'Connection': 'keep-alive'
        }
    })
        .node('!.*', (message) => {
            consumerList.insertAdjacentHTML('beforeend', `<li class="collection-item center">${message.value}</li>`)
            consumerListItems.push(message.value)
        })
        .on('error', (err) => {
            console.error(err);
        })

    search = () => {
        let input = document.getElementById('consumer_Input').value
        let consumerListItemsFiltered = []

        for (let i = 0; i < consumerListItems.length; i++) {
            if (consumerListItems[i].toUpperCase().match(`.?${input.toUpperCase()}.?`)) {
                consumerListItemsFiltered.push(consumerListItems[i])
            }
        }

        while (consumerList.firstChild) {
            consumerList.removeChild(consumerList.firstChild);
        }

        consumerList.insertAdjacentHTML('beforeend', `<li class="collection-header center"><h5>Messages</h5></li>`)
        for (let i = 0; i < consumerListItemsFiltered.length; i++) {
            consumerList.insertAdjacentHTML('beforeend', `<li class="collection-item center">${consumerListItemsFiltered[i]}</li>`)
        }
    }

});