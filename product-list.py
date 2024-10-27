import stripe
stripe.api_key = "sk_test_51QEMc8JqQJ6ImKtfgyO3a9f1Rhv8qyQIXHuo3y2zeK5hXEftTarf4x3yilW1qGaKp4zaCxLVpLcp1iFaoVSbyloI00IBbcE726"

print(stripe.Product.list())

# stripe.Price.list(
#   product='{{prod_R6ckXQbiWr7vHL}}',
#   active=True,
# )

