"use client";
import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import Otp from './Otp';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

const Login: React.FC = () => {
  const router = useRouter();
  const { t } = useI18n();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email: string; password: string; form: string }>({ email: '', password: '', form: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [otp, setOtp] = useState<boolean>(false);
  const who = 'user';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email') {
      if (!value.trim()) error = t('auth.emailRequired');
      else if (!emailRegex.test(value)) error = t('auth.invalidEmail');
    }
    if (name === 'password') {
      if (!value) error = t('auth.passwordRequired');
      else if (value.length < 8) error = t('auth.passwordMin');
      else if (!passwordRegex.test(value)) error = t('auth.invalidPassword');
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const isEmailValid = emailRegex.test(formData.email);
    const isPasswordValid = formData.password.length >= 8;
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      form: ''
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== '');
    if (hasErrors || !isFormValid) {
      setErrors(prev => ({ ...prev, form: t('auth.fixErrors') }));
      return;
    }

    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const apiBase = isLocal ? 'http://localhost:5000/api/v1/users' : 'https://e-commerce-back-xy6s.onrender.com/api/v1/users';
    const api = `${apiBase}/${who === 'user' ? 'login' : 'admin-login'}`;

    setIsLoading(true);
    try {
      const response = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({} as Record<string, unknown>));
        const message = typeof (errorData as Record<string, unknown>).message === 'string' ? (errorData as Record<string, unknown>).message : '';
        const finalMessage = message || t('auth.loginFailed');
        throw new Error(String(finalMessage));
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      setSuccessMessage(t('auth.loggedIn'));
      setTimeout(() => { 
        router.push('/'); 
        setSuccessMessage(''); 
      }, 1200);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err instanceof Error ? err.message : t('auth.invalidCredentials') }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-screen">
      <main className="flex-grow">
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="hidden lg:block relative bg-gradient-to-br from-[#634bc1] to-[#ffdc89] w-full">
            <div className="absolute inset-0 bg-center bg-cover mix-blend-overlay opacity-20" style={{ backgroundImage: `url("Easy.png")` }} />
            <div className="relative h-full flex flex-col justify-center p-12 w-full text-white">
              <h2 className="text-4xl font-bold mb-4">{t('auth.welcomeBack')}</h2>
              <p className="text-xl mb-8">{t('auth.loginToAccess')}</p>
              <div className="flex space-x-4">
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all" aria-label="Google"><FaGoogle className="text-lg" /></button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all" aria-label="Facebook"><FaFacebookF className="text-lg" /></button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all" aria-label="Twitter"><FaTwitter className="text-lg" /></button>
              </div>
            </div>
          </div>

          <div className="bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16">
            {otp ? <Otp /> : (
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.loginTo', { brand: 'ShopEasy' })}</h1>
                  <p className="text-gray-600">{t('auth.enterDetails')}</p>
                </div>

                <div className={`mb-4 p-3 ${!successMessage ? 'text-red-700' : 'text-blue-500'} rounded-lg text-md`}>{!successMessage ? errors.form : successMessage}</div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.emailAddress')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiOutlineMail className="h-5 w-5 text-gray-400" /></div>
                      <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} onBlur={(e) => setErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }))} className={`block w-full text-gray-700 pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#634bc1] focus:border-[#634bc1] placeholder-gray-400`} placeholder={t('auth.emailPlaceholder')} />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><HiOutlineLockClosed className="h-5 w-5 text-gray-400" /></div>
                      <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={formData.password} onChange={handleChange} onBlur={(e) => setErrors(prev => ({ ...prev, password: validateField('password', e.target.value) }))} className={`block w-full text-gray-700 pl-10 pr-10 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#634bc1] focus:border-[#634bc1] placeholder-gray-400`} placeholder={t('auth.passwordPlaceholder')} />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}>{showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />}</button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#634bc1] focus:ring-[#634bc1] border-gray-300 rounded" />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">{t('auth.rememberMe')}</label>
                    </div>
                    <div className="text-sm"><a href="#" className="font-medium text-[#634bc1] hover:text-[#5239ad]">{t('auth.forgotPassword')}</a></div>
                  </div>

                  <div>
                    <button type="submit" disabled={isLoading || !isFormValid} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#634bc1] hover:bg-[#5239ad] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#634bc1] transition-colors ${isLoading || !isFormValid ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {isLoading ? <span className="flex items-center"><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{t('auth.signingIn')}</span> : t('auth.signIn')}
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">{t('auth.orContinueWith')}</span></div></div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#634bc1]" aria-label="Google"><FaGoogle className="h-5 w-5 text-[#DB4437]" /></button>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#634bc1]" aria-label="Facebook"><FaFacebookF className="h-5 w-5 text-[#4267B2]" /></button>
                    <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#634bc1]" aria-label="Twitter"><FaTwitter className="h-5 w-5 text-[#1DA1F2]" /></button>
                  </div>
                </div>

                <div className="mt-6 text-center text-sm"><p className="text-gray-600">{t('auth.dontHaveAccount')}{' '}<Link href="/signup" className="font-medium text-[#634bc1] hover:text-[#5239ad]">{t('auth.signUp')}</Link></p></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;