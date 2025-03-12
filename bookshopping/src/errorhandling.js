export const RequiredValidate = (value, fieldname) => {
    if (!value) {
      return `${fieldname} is required`;
    }
    return '';
  };
  
  export const GmailValidate = (gmail) => {
    if (gmail.includes(' ') || !gmail.endsWith('@gmail.com')) {
      return 'Gmail must end with @gmail.com and cannot contain spaces.';
    }
    return '';
  };
  
  export const PhoneValidate = (phone) => {
    const phoneAsNumber = Number(phone);
    if (phone.length === 10 && !isNaN(phoneAsNumber) && /^[0-9]{10}$/.test(phone)) {
      return '';
    }
    return 'Phone number must be 10 digits and contain only numbers.';
  };
  
  export const PasswordValidate = (password) => {
    let errorMessage = '';
  
    if (password.length <= 8) {
      errorMessage += 'Password must be longer than 8 characters. ';
    }
    if (!/[0-9]/.test(password)) {
      errorMessage += 'Password must contain at least one number. ';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errorMessage += 'Password must contain at least one special character. ';
    }
    if (!/[A-Z]/.test(password)) {
      errorMessage += 'Password must contain at least one uppercase letter. ';
    }
  
    return errorMessage.trim() || '';
  };
  
  export const rePasswordValidate = (password, rePassword) => {
    if (password !== rePassword) {
      return 'Password and re-entered password do not match.';
    }
    return '';
  };
  