import React, { useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
}) {
  // =========================================================
  // AUTH MODE
  // =========================================================

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // =========================================================
  // FORM STATE
  // =========================================================

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // =========================================================
  // UI STATE
  // =========================================================

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(false);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    onClose();
  };

  // =========================================================
  // SWITCH LOGIN / REGISTER MODE
  // =========================================================

  const switchMode = () => {
    if (isSubmitting) {
      return;
    }

    setIsRegisterMode((previous) => !previous);

    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
  };

  // =========================================================
  // FORM SUBMISSION
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMsg('');
    setSuccessMsg('');

    // ---------------------------------------------------------
    // BASIC FRONTEND VALIDATION
    // ---------------------------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    if (!normalizedEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // =======================================================
      // REGISTER
      // =======================================================

      if (isRegisterMode) {
        const registerResponse = await fetch(
          `${API_BASE}/api/auth/register`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: normalizedEmail,
              password: password,
            }),
          }
        );

        const registerData = await registerResponse.json();

        // -----------------------------------------------------
        // REGISTRATION FAILED
        // -----------------------------------------------------

        if (!registerResponse.ok) {
          throw new Error(
            registerData.detail ||
              'Unable to create the account.'
          );
        }

        // =======================================================
        // AUTOMATIC LOGIN AFTER REGISTRATION
        // =======================================================

        const loginResponse = await fetch(
          `${API_BASE}/api/auth/login`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: normalizedEmail,
              password: password,
            }),
          }
        );

        const loginData = await loginResponse.json();

        // -----------------------------------------------------
        // AUTOMATIC LOGIN FAILED
        // -----------------------------------------------------

        if (!loginResponse.ok) {
          throw new Error(
            loginData.detail ||
              'Account created, but automatic login failed.'
          );
        }

        // -----------------------------------------------------
        // LOGIN SUCCESSFUL
        // -----------------------------------------------------

        if (loginData.user) {
          onLogin(loginData.user);
        }

        resetForm();
        onClose();

        return;
      }

      // =======================================================
      // LOGIN
      // =======================================================

      const response = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password: password,
          }),
        }
      );

      const data = await response.json();

      // -------------------------------------------------------
      // LOGIN FAILED
      // -------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Invalid email or password.'
        );
      }

      // -------------------------------------------------------
      // LOGIN SUCCESSFUL
      // -------------------------------------------------------

      if (data.user) {
        onLogin(data.user);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(
        'Authentication error:',
        error
      );

      setErrorMsg(
        error.message ||
          'Authentication request failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // MODAL NOT OPEN
  // =========================================================

  if (!isOpen) {
    return null;
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

      {/* =====================================================
          MODAL CONTAINER
      ====================================================== */}

      <div className="w-full max-w-md bg-surface border border-app rounded-2xl shadow-2xl overflow-hidden">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="px-6 py-5 border-b border-app flex items-start justify-between">

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-app-muted font-mono">
              WEBSECURE
            </p>

            <h2 className="mt-1 text-xl font-semibold text-app-primary">
              {isRegisterMode
                ? 'Create Account'
                : 'Sign In'}
            </h2>

            <p className="mt-1 text-xs text-app-secondary">
              {isRegisterMode
                ? 'Create your WebSecure security account.'
                : 'Access your WebSecure security workspace.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-app-muted hover:text-app-primary text-lg leading-none cursor-pointer disabled:opacity-40"
            aria-label="Close authentication modal"
          >
            ✕
          </button>

        </div>

        {/* ===================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-5"
        >

          {/* =================================================
              ERROR MESSAGE
          ================================================== */}

          {errorMsg && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5">
              <p className="text-xs text-red-400">
                {errorMsg}
              </p>
            </div>
          )}

          {/* =================================================
              SUCCESS MESSAGE
          ================================================== */}

          {successMsg && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
              <p className="text-xs text-emerald-400">
                {successMsg}
              </p>
            </div>
          )}

          {/* =================================================
              EMAIL
          ================================================== */}

          <div>
            <label
              htmlFor="auth-email"
              className="block mb-2 text-xs font-medium text-app-secondary"
            >
              Email address
            </label>

            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-app bg-app px-3 py-2.5 text-sm text-app-primary placeholder:text-app-muted outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* =================================================
              PASSWORD
          ================================================== */}

          <div>
            <label
              htmlFor="auth-password"
              className="block mb-2 text-xs font-medium text-app-secondary"
            >
              Password
            </label>

            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete={
                isRegisterMode
                  ? 'new-password'
                  : 'current-password'
              }
              disabled={isSubmitting}
              className="w-full rounded-lg border border-app bg-app px-3 py-2.5 text-sm text-app-primary placeholder:text-app-muted outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* =================================================
              SUBMIT BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm py-2.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isRegisterMode
                ? 'Creating Account...'
                : 'Signing In...'
              : isRegisterMode
                ? 'Create Account'
                : 'Sign In'}
          </button>

          {/* =================================================
              MODE SWITCH
          ================================================== */}

          <div className="text-center pt-1">
            <p className="text-xs text-app-secondary">
              {isRegisterMode
                ? 'Already have an account?'
                : "Don't have an account?"}
            </p>

            <button
              type="button"
              onClick={switchMode}
              disabled={isSubmitting}
              className="mt-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer disabled:opacity-40"
            >
              {isRegisterMode
                ? 'Sign in'
                : 'Create an account'}
            </button>
          </div>

        </form>

        {/* ===================================================
            SECURITY FOOTER
        ==================================================== */}

        <div className="px-6 py-4 border-t border-app bg-black/10">
          <p className="text-[10px] text-app-muted text-center font-mono">
            AUTHENTICATED SESSION • WEBSECURE
          </p>
        </div>

      </div>
    </div>
  );
}