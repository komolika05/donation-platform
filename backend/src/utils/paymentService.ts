import Stripe from "stripe";
import paypal from "paypal-rest-sdk";
import logger from "./logger";

// Initialize Stripe
const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]!, {
  apiVersion: "2023-10-16",
});

// Initialize PayPal
paypal.configure({
  mode: process.env["PAYPAL_MODE"] || "sandbox",
  client_id: process.env["PAYPAL_CLIENT_ID"]!,
  client_secret: process.env["PAYPAL_CLIENT_SECRET"]!,
});

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string | undefined;
}

export interface PayPalPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  approvalUrl?: string;
}

// Stripe payment functions
export const createStripePaymentIntent = async (
  amount: number,
  currency: string,
  metadata: Record<string, string>
): Promise<PaymentIntent> => {
  try {
    logger.info("Creating Stripe payment intent", {
      amount,
      currency,
      metadata,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    logger.info("Stripe payment intent created successfully", {
      paymentIntentId: paymentIntent.id,
      amount,
      currency,
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret ?? undefined,
    };
  } catch (error) {
    logger.error("Error creating Stripe payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
};

export const confirmStripePayment = async (
  paymentIntentId: string
): Promise<PaymentIntent> => {
  try {
    logger.info("Confirming Stripe payment", { paymentIntentId });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    logger.info("Stripe payment confirmed", {
      paymentIntentId,
      status: paymentIntent.status,
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
    };
  } catch (error) {
    logger.error("Error confirming Stripe payment:", error);
    throw new Error("Failed to confirm payment");
  }
};

// PayPal payment functions
export const createPayPalPayment = async (
  amount: number,
  currency: string,
  returnUrl: string,
  cancelUrl: string,
  description: string
): Promise<PayPalPayment> => {
  return new Promise((resolve, reject) => {
    logger.info("Creating PayPal payment", { amount, currency, description });

    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: description,
                sku: "donation",
                price: amount.toFixed(2),
                currency,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency,
            total: amount.toFixed(2),
          },
          description,
        },
      ],
    };

    paypal.payment.create(paymentData, (error: any, payment: any) => {
      if (error) {
        logger.error("Error creating PayPal payment:", error);
        reject(new Error("Failed to create PayPal payment"));
      } else {
        logger.info("PayPal payment created successfully", {
          paymentId: payment.id,
          amount,
          currency,
        });

        const approvalUrl = payment.links?.find(
          (link: any) => link.rel === "approval_url"
        )?.href;

        resolve({
          id: payment.id,
          amount,
          currency,
          status: payment.state,
          approvalUrl,
        });
      }
    });
  });
};

export const executePayPalPayment = async (
  paymentId: string,
  payerId: string
): Promise<PayPalPayment> => {
  return new Promise((resolve, reject) => {
    logger.info("Executing PayPal payment", { paymentId, payerId });

    const executePaymentJson = {
      payer_id: payerId,
    };

    paypal.payment.execute(
      paymentId,
      executePaymentJson,
      (error: any, payment: any) => {
        if (error) {
          logger.error("Error executing PayPal payment:", error);
          reject(new Error("Failed to execute PayPal payment"));
        } else {
          logger.info("PayPal payment executed successfully", {
            paymentId,
            status: payment.state,
          });

          const transaction = payment.transactions?.[0];
          const amount = Number.parseFloat(transaction?.amount?.total || "0");

          resolve({
            id: payment.id,
            amount,
            currency: transaction?.amount?.currency || "USD",
            status: payment.state,
          });
        }
      }
    );
  });
};

// Currency conversion (using Stripe's rates as example)
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    if (fromCurrency === toCurrency) return amount;

    logger.info("Converting currency", { amount, fromCurrency, toCurrency });

    // For demo purposes, using fixed rates. In production, use a real currency API
    const exchangeRates: Record<string, Record<string, number>> = {
      USD: { CAD: 1.35, USD: 1 },
      CAD: { USD: 0.74, CAD: 1 },
    };

    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      throw new Error(
        `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
      );
    }

    const convertedAmount = amount * rate;
    logger.info("Currency converted successfully", {
      originalAmount: amount,
      convertedAmount,
      rate,
    });

    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    logger.error("Error converting currency:", error);
    throw new Error("Failed to convert currency");
  }
};

export { stripe };
