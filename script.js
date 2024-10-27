document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe('pk_test_51QEMwJQuGWNDNoDwtiLLlXCTDKvHD3cjfAZ8aZO13kky0hWo5nteaOam9Va0ccXl2trfC0i6wqxtPsUj44bAMEls00md6kF4Fc');
    const purchaseForm = document.getElementById('purchase-form');

    purchaseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const minutes = document.getElementById('minutes').value;

        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type':   'application/json'
            },
            body: JSON.stringify({ minutes })
        });

        const session = await response.json();
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
            alert(result.error.message);
        }
    });
});