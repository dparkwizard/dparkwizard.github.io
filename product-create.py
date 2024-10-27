# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "sk_test_51QEMc8JqQJ6ImKtfgyO3a9f1Rhv8qyQIXHuo3y2zeK5hXEftTarf4x3yilW1qGaKp4zaCxLVpLcp1iFaoVSbyloI00IBbcE726"

print(stripe.Product.create(
  name="Halloween offer (Monthly)",
  description="$2.99 per month",
))