function validate(data) {
    if (!data.username || data.username.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' };
    }
    if (!data.email || !data.email.includes('@')) {
        return { valid: false, message: 'Invalid email' };
    }
    if (!data.password || data.password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    return { valid: true };
}