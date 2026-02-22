// Minimal main.js placeholder
document.addEventListener('DOMContentLoaded', function () {
  // Keep global behavior safe if config scripts are missing
  if (typeof renderPage === 'function') {
    try { renderPage(); } catch (e) { console.warn('renderPage failed', e); }
  }
  
  // Wire up payment method buttons to launch Paystack with specific channel
  document.addEventListener("click", function(e) {
    const btn = e.target.closest(".pay-method-btn[data-channel]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    
    const channel = btn.getAttribute("data-channel");
    
    // Get the selected amount from localStorage
    let amount = localStorage.getItem("amount-selected");
    if (!amount) {
      // Show error toast
      const toast = document.getElementById("toast-error");
      if (toast) {
        toast.classList.remove("hidden");
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
          toast.classList.add("hidden");
        }, 4000);
      }
      return;
    }
    amount = parseFloat(amount);
    
    if (amount && amount > 0) {
      // Set flag to prevent modal from closing during payment
      if (typeof _paystackActive !== 'undefined') {
        _paystackActive = true;
      }
      
      // Call the payment function with the specific channel
      if (typeof launchPaystackForAmount === 'function') {
        launchPaystackForAmount(amount, channel);
      }
    }
  });
});
