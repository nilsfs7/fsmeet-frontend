import Navigation from '@/components/Navigation';
import { LoginForm } from './components/login-form';
import Link from 'next/link';
import { routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import Image from 'next/image';

export default async function Page() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-8">
          <div className="max-w-md text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to FSMeet</h1>
            <p className="text-lg mb-6">Connect with fellow sports enthusiasts, join competitions, and discover new opportunities.</p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Easy Registration</h3>
                <p className="text-sm text-white/80">Create your account in minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Connect with Others</h3>
                <p className="text-sm text-white/80">Find teammates and competitors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 md:p-8 flex justify-end">
            <Link href={routeHome} className="text-gray-500 hover:text-primary transition-colors">
              <ActionButton action={Action.BACK} />
            </Link>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
