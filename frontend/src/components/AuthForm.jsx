import { useState } from 'react';

const initialAuthForm = {
  name: '',
  email: '',
  password: '',
};

export default function AuthForm({ onLogin, onRegister, loading }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authForm, setAuthForm] = useState(initialAuthForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: authForm.name.trim(),
      email: authForm.email.trim(),
      password: authForm.password,
    };

    const isSuccess = isLoginMode
      ? await onLogin({ email: payload.email, password: payload.password })
      : await onRegister(payload);

    if (isSuccess) {
      setAuthForm(initialAuthForm);
    }
  };

  return (
    <section className="card auth-card">
      <div className="auth-aside">
        <p className="auth-badge">Secure Workspace</p>
        <h2>{isLoginMode ? 'Welcome back' : 'Create your account'}</h2>
        <p>
          {isLoginMode
            ? 'Login to manage your priorities, deadlines, and progress from one place.'
            : 'Register in seconds and start organizing your tasks with a modern workflow.'}
        </p>
        <ul className="auth-points">
          <li>Track priorities and due dates.</li>
          <li>Organize tasks with smart filtering.</li>
        </ul>
      </div>

      <div className="auth-panel">
        <div className="auth-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={isLoginMode ? 'active' : ''}
            onClick={() => setIsLoginMode(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLoginMode ? 'active' : ''}
            onClick={() => setIsLoginMode(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={authForm.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={authForm.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={authForm.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLoginMode ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </section>
  );
}
