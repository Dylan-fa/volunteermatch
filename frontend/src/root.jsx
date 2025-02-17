import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './contexts/UserContext';
import NavBar from './components/NavBar';
import GoogleOneTap from './components/GoogleOneTap';
import "./index.css";

export function Layout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Volunterra</title>
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setGradientPosition(scrollPosition * 0.2);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const gradientStyle = {
    backgroundPosition: `${gradientPosition}% 50%`,
  };
    return (
        <GoogleOAuthProvider clientId="1032409090840-gus43isikcnuq4n365l7gocm53h725dl.apps.googleusercontent.com">
          <UserProvider>
              <div className="min-h-screen bg-gray-50">
                <NavBar isScrolled={isScrolled} gradientStyle={gradientStyle} />
                <GoogleOneTap />
                <AnimatePresence mode="wait">
                  <main className="pt-16">
                    <Outlet />
                  </main>
                </AnimatePresence>
              </div>
          </UserProvider>
        </GoogleOAuthProvider>
    );
}
