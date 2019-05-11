const stripeCheckout = function() {

const stripePublishableKey = document.querySelector('#stripeApiKey').dataset.value;

const stripe = Stripe(stripePublishableKey);
    const elements = stripe.elements();
    const form = document.getElementById('payment-form');
    
    const style = {
        base: {
            fontSize: '16px',
            color: "#32325d",

        },
    }

    const card = elements.create('card', {style});

    card.mount('#card-element');

    card.addEventListener('change', ({error}) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = '';
        }
    });


    // Create a token or display an error when the form is submitted.

        form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const {token, error} = await stripe.createToken(card);

        if (error) {
            // Inform the customer that there was an error.
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
        } else {
            // Send the token to your server.
            stripeTokenHandler(token);
        }
        });

        function stripeTokenHandler(token) {
            console.log('token:', token);
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);
            
            // submit the form
            form.submit();
        }

    }();