import React, { useState } from 'react';
import './PremiumPayment.css';

function PremiumPayment({ onClose, onUpgrade, currentUser }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const plans = {
    monthly: {
      name: 'Monthly',
      price: 29,
      duration: 'month',
      savings: 0,
      popular: false
    },
    quarterly: {
      name: 'Quarterly',
      price: 79,
      duration: '3 months',
      savings: 8,
      popular: true
    },
    yearly: {
      name: 'Yearly',
      price: 299,
      duration: 'year',
      savings: 49,
      popular: false
    }
  };

  const features = [
    { icon: '✅', text: 'Unlimited expense entries', premium: true },
    { icon: '✅', text: 'Advanced analytics & insights', premium: true },
    { icon: '✅', text: 'Category-wise budget tracking', premium: true },
    { icon: '✅', text: 'Export to CSV/PDF', premium: true },
    { icon: '✅', text: 'Cloud backup & sync', premium: true },
    { icon: '✅', text: 'Priority customer support', premium: true },
    { icon: '✅', text: 'Ad-free experience', premium: true },
    { icon: '✅', text: 'Custom categories', premium: true },
    { icon: '✅', text: 'Recurring expense tracking', premium: true },
    { icon: '✅', text: 'Multi-currency support', premium: true }
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // In real app, integrate with payment gateway (Razorpay, Stripe, etc.)
      const paymentData = {
        plan: selectedPlan,
        amount: plans[selectedPlan].price,
        method: paymentMethod,
        timestamp: new Date().toISOString(),
        transactionId: 'TXN' + Date.now()
      };

      // Save payment info
      localStorage.setItem('premiumPayment', JSON.stringify(paymentData));
      
      setProcessing(false);
      onUpgrade();
      
      alert(`🎉 Payment Successful!\n\nTransaction ID: ${paymentData.transactionId}\nAmount: ₹${paymentData.amount}\nPlan: ${plans[selectedPlan].name}\n\nWelcome to Premium!`);
    }, 2000);
  };

  return (
    <div className="premium-overlay">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="premium-header">
          <h1>⭐ Upgrade to Premium</h1>
          <p>Unlock unlimited features and take control of your finances</p>
        </div>

        {!showPaymentForm ? (
          <>
            {/* Pricing Plans */}
            <div className="pricing-section">
              <h2>Choose Your Plan</h2>
              <div className="pricing-cards">
                {Object.entries(plans).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`pricing-card ${selectedPlan === key ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedPlan(key)}
                  >
                    {plan.popular && <div className="popular-badge">Most Popular</div>}
                    <h3>{plan.name}</h3>
                    <div className="price">
                      <span className="currency">₹</span>
                      <span className="amount">{plan.price}</span>
                      <span className="duration">/{plan.duration}</span>
                    </div>
                    {plan.savings > 0 && (
                      <div className="savings">Save ₹{plan.savings}</div>
                    )}
                    <div className="per-month">
                      ₹{Math.round(plan.price / (key === 'yearly' ? 12 : key === 'quarterly' ? 3 : 1))}/month
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="features-section">
              <h2>Premium Features</h2>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-icon">{feature.icon}</span>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="guarantee-section">
              <div className="guarantee-badge">
                <span className="guarantee-icon">🛡️</span>
                <div>
                  <strong>7-Day Money Back Guarantee</strong>
                  <p>Not satisfied? Get a full refund within 7 days</p>
                </div>
              </div>
            </div>

            <button 
              className="proceed-btn"
              onClick={() => setShowPaymentForm(true)}
            >
              Proceed to Payment - ₹{plans[selectedPlan].price}
            </button>
          </>
        ) : (
          <>
            {/* Payment Form */}
            <div className="payment-section">
              <button className="back-btn" onClick={() => setShowPaymentForm(false)}>
                ← Back to Plans
              </button>

              <div className="payment-summary">
                <h3>Payment Summary</h3>
                <div className="summary-row">
                  <span>Plan:</span>
                  <span>{plans[selectedPlan].name}</span>
                </div>
                <div className="summary-row">
                  <span>Duration:</span>
                  <span>{plans[selectedPlan].duration}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{plans[selectedPlan].price}</span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="method-buttons">
                  <button
                    className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    💳 Credit/Debit Card
                  </button>
                  <button
                    className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    📱 UPI
                  </button>
                  <button
                    className={`method-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    🏦 Net Banking
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              {paymentMethod === 'card' && (
                <div className="payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength="19"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength="3"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="payment-form">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="upi-info">
                    <p>💡 Enter your UPI ID to proceed with payment</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="payment-form">
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select>
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="secure-payment">
                <span>🔒</span>
                <span>Secure payment powered by industry-standard encryption</span>
              </div>

              <button 
                className="pay-btn"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? '⏳ Processing...' : `💳 Pay ₹${plans[selectedPlan].price}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PremiumPayment;
