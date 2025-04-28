import React, { useState, useEffect } from "react";
import './Cart.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from "js-cookie";
import KhaltiCheckout from "khalti-checkout-web";

const Dashboard = () => {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentPortal, setPaymentPortal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("Khalti");

    // Fetch cart items from backend
    const fetchCart = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/cart/getcart', { token });
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Handle item removal from cart
    const handleRemove = async (id) => {
        try {
            await axios.post('http://localhost:5000/api/cart/removecart', { token, id });
            fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Handle checkout
    const handleCheckout = async (id) => {
        try {
            const response = await axios.post('http://localhost:5000/api/cart/checkout', { id });
            setCheckoutData(response.data);
            setPaymentPortal(true);
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    // Handle payment
    const handlePayment = async () => {
        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        const totalAmount = (checkoutData.originalPrice * checkoutData.quantity) - 
                            ((checkoutData.offer / 100) * (checkoutData.originalPrice * checkoutData.quantity));
        
        const paymentDetails = {
            amount: totalAmount,
            productName: checkoutData.bookName,
            productUrl: "http://localhost:3000/cart",
        };

        if (selectedPayment === "Khalti") {
            initiateKhaltiPayment(paymentDetails);
        }

        setPaymentPortal(false);  // Close after choosing
    };

    // Khalti Payment

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://khalti.com/static/khalti-checkout.js";
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);
      
      
      const initiateKhaltiPayment = (paymentDetails) => {
        const config = {
            publicKey: "test_key_f6afe4893fcd487cb5bbec1b295924f7", // your TEST public key
            productIdentity: "1234567890",
            productName: paymentDetails.productName,
            productUrl: paymentDetails.productUrl,
            paymentPreference: [
                "KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"
            ],
            eventHandler: {
                onSuccess(payload) {
                    console.log('Payment Success', payload);
                    
                    // 🛠 Now verifying with your backend
                    fetch('/api/khalti/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: payload.token,
                            amount: payload.amount,
                        }),
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('Verification Response:', data);
                        if (data.status === "Completed") {
                            alert("Payment Verified Successfully! 🎉");
                        } else {
                            alert("Payment Verification Failed ❌");
                        }
                    })
                    .catch(error => {
                        console.error('Verification Error:', error);
                        alert("Server Error During Verification ❌");
                    });
                },
                onError(error) {
                    console.log('Payment Error', error);
                    alert("Payment Failed! ❌");
                },
                onClose() {
                    console.log('Payment Popup Closed');
                }
            }
        };
    
        const checkout = new window.KhaltiCheckout(config);
        checkout.show({ amount: 1000 }); // amount in paisa (1000 = Rs.10)
    };
    

    // Send payment success to server
    const sendPaymentDetailsToServer = async (payload) => {
        try {
            const response = await axios.post('http://localhost:5000/api/payment/verify', {
                transactionId: payload.idx,   // or payload.transaction_id based on your server expectation
                amount: payload.amount / 100, // Convert back to rupees
                status: "Completed",          // Assuming successful
            });
            alert(response.data.status === "success" ? "Payment successful!" : "Payment failed.");
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error while verifying payment.");
        }
    };

    // Handle Payment Option Change
    const handlePaymentOptionChange = (event) => {
        setSelectedPayment(event.target.value);
    };

    return (
        <div className="home-maincontent">
            <div className="firstdiv">
                <div className="home-logo">
                    <img src="/logo.gif.gif" alt="Logo" className="logo-gif" />
                </div>
                <div className="home-searchbar">
                    <input type="text" placeholder="What do you want to Read?" id="search" />
                </div>
                <div style={{ display: "flex" }}>
                    <div className="cart"><p>Cart</p></div>
                    <div className="signin" onClick={() => navigate('/profile')}><p>Profile</p></div>
                </div>
            </div>

            <div className="cart-items-container">
                {cartItems.map((item, index) => (
                    <div className="cart-item" key={index}>
                        <img src={`http://localhost:5000${item.bookImageUrl}`} alt={item.bookName} className="cart-book-image" />
                        <div className="cart-item-details">
                            <h3>{item.bookName}</h3>
                            <p>Price: ₹{item.originalPrice}</p>
                            <p>Quantity: {item.quantity}</p>
                            <div className="cart-item-buttons">
                                <button className="checkout-btn" onClick={() => handleCheckout(item.cartId)}>Checkout</button>
                                <button className="remove-btn" onClick={() => handleRemove(item.cartId)}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Portal Modal */}
            {paymentPortal && checkoutData && (
                <div className="payment-portal-overlay">
                    <div className="payment-portal">
                        <h2>Checkout</h2>
                        <div className="payment-details">
                            <p><strong>Book Name:</strong> {checkoutData.bookName}</p>
                            <p><strong>Quantity:</strong> {checkoutData.quantity}</p>
                            <p><strong>Offer:</strong> {checkoutData.offer}% OFF</p>
                            <p><strong>Original Price:</strong> ₹{checkoutData.originalPrice}</p>
                            <p><strong>Total Amount:</strong> ₹{(checkoutData.originalPrice * checkoutData.quantity) - ((checkoutData.offer / 100) * (checkoutData.originalPrice * checkoutData.quantity))}</p>
                        </div>

                        <div className="payment-options">
                            <label>
                                <input type="radio" value="Khalti" checked={selectedPayment === "Khalti"} onChange={handlePaymentOptionChange} />
                                Khalti
                            </label>
                        </div>

                        <button onClick={handlePayment} className="confirm-payment-btn">Confirm Payment</button>
                        <button onClick={() => setPaymentPortal(false)} className="close-payment-btn">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
