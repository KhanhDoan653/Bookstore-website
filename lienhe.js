// Form validation and submission handling
function validateForm() {
    // Get form inputs
    const nameInput = document.querySelector('.contact-right input[type="text"]');
    const emailInput = document.querySelector('.contact-right input[type="email"]');
    const messageInput = document.querySelector('.contact-right textarea');
    
    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validation checks
    if (name === '') {
        alert('Vui lòng nhập họ tên của bạn.');
        nameInput.focus();
        return false;
    }
    
    if (!emailPattern.test(email)) {
        alert('Vui lòng nhập email hợp lệ.');
        emailInput.focus();
        return false;
    }
    
    if (message === '') {
        alert('Vui lòng nhập nội dung lời nhắn.');
        messageInput.focus();
        return false;
    }
    
    // If validation passes, show success message and reset form
    alert('Cảm ơn bạn đã gửi lời nhắn! Chúng tôi sẽ liên hệ sớm nhất có thể.');
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
    
    return false; // Prevent form submission (for demo purposes; remove if integrating with a backend)
}

// Add event listener to form submission
document.querySelector('.contact-right form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    validateForm();
});