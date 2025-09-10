// Authentication functionality
(function(){
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const switchFormLinks = document.querySelectorAll('.switch-form');
  const emailLoginForm = document.getElementById('email-login-form');
  const emailRegisterForm = document.getElementById('email-register-form');
  const socialBtns = document.querySelectorAll('.social-btn');

  // Form switching functionality
  switchFormLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetForm = e.target.getAttribute('data-target');
      
      if (targetForm === 'register-form') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
      } else {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
      }
    });
  });

  // Email login form submission
  if (emailLoginForm) {
    emailLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const rememberMe = document.getElementById('remember-me').checked;
      
      // Basic validation
      if (!validateEmail(email)) {
        showError('login-email', 'Please enter a valid email address');
        return;
      }
      
      if (password.length < 6) {
        showError('login-password', 'Password must be at least 6 characters');
        return;
      }
      
      // Clear any previous errors
      clearErrors();
      
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Login attempt:', { email, rememberMe });
        
        // In a real application, you would make an API call here
        // For demo purposes, we'll just show a success message
        showSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
          // Redirect to dashboard or home page
          window.location.href = 'index.html';
        }, 1500);
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Email registration form submission
  if (emailRegisterForm) {
    emailRegisterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Get interests as array
      const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
        .map(cb => cb.value);
      
      data.interests = interests;
      
      // Validation
      if (!validateRegistrationForm(data)) {
        return;
      }
      
      // Clear any previous errors
      clearErrors();
      
      // Show loading state
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registration attempt:', data);
        
        // In a real application, you would make an API call here
        showSuccess('Account created successfully! Please check your email to verify your account.');
        
        setTimeout(() => {
          // Switch back to login form
          registerForm.classList.add('hidden');
          loginForm.classList.remove('hidden');
        }, 2000);
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Social login buttons
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const provider = btn.classList.contains('google-btn') ? 'Google' :
                      btn.classList.contains('facebook-btn') ? 'Facebook' : 'Apple';
      
      console.log(`${provider} login clicked`);
      
      // In a real application, you would integrate with OAuth providers
      alert(`${provider} login would be implemented here using OAuth`);
    });
  });

  // Real-time password confirmation validation
  const passwordField = document.getElementById('register-password');
  const confirmPasswordField = document.getElementById('confirm-password');
  
  if (confirmPasswordField) {
    confirmPasswordField.addEventListener('input', () => {
      const password = passwordField.value;
      const confirmPassword = confirmPasswordField.value;
      
      if (confirmPassword && password !== confirmPassword) {
        showError('confirm-password', 'Passwords do not match');
      } else {
        clearError('confirm-password');
      }
    });
  }

  // Helper functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateRegistrationForm(data) {
    let isValid = true;
    
    // Required fields
    if (!data.firstName?.trim()) {
      showError('first-name', 'First name is required');
      isValid = false;
    }
    
    if (!data.lastName?.trim()) {
      showError('last-name', 'Last name is required');
      isValid = false;
    }
    
    if (!validateEmail(data.email)) {
      showError('register-email', 'Please enter a valid email address');
      isValid = false;
    }
    
    if (!data.password || data.password.length < 8) {
      showError('register-password', 'Password must be at least 8 characters');
      isValid = false;
    }
    
    if (data.password !== data.confirmPassword) {
      showError('confirm-password', 'Passwords do not match');
      isValid = false;
    }
    
    if (!data.experience) {
      showError('experience', 'Please select your experience level');
      isValid = false;
    }
    
    if (!data.terms) {
      showError('terms', 'You must agree to the terms and conditions');
      isValid = false;
    }
    
    return isValid;
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add error class and message
    field.classList.add('error');
    field.classList.remove('success');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    field.classList.remove('error');
    field.classList.add('success');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    
    errorMessages.forEach(msg => msg.remove());
    errorFields.forEach(field => {
      field.classList.remove('error');
    });
  }

  function showSuccess(message) {
    // Remove existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
      existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const authCard = document.querySelector('.auth-card:not(.hidden)');
    const authForm = authCard.querySelector('.auth-form');
    authForm.insertBefore(successDiv, authForm.firstChild);
  }

  // Initialize form validation styling
  const inputs = document.querySelectorAll('input[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim() && !input.classList.contains('error')) {
        input.classList.add('success');
      }
    });
    
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const errorMessage = input.closest('.form-group').querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  });
})();
