import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';

export const Header = () => {
  const { user, logout } = useAuth();
  const { navigate, currentPage } = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'Predict', path: 'predict' },
    { name: 'Emergency', path: 'emergency' },
    { name: 'About', path: 'about' },
    { name: 'FAQ', path: 'faq' },
    { name: 'Community', path: 'community' },
  ];

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <motion.div
            onClick={() => navigate('home')}
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="https://github.com/Ishaan145/auracast/blob/main/frontend/team-logo.png?raw=true" 
              alt="AuraCast Logo" 
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback to gradient background with 'A' if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center';
                fallback.innerHTML = '<span class="text-white font-bold text-lg">A</span>';
                target.parentNode?.insertBefore(fallback, target);
              }}
            />
            <span className="text-xl md:text-2xl font-bold gradient-text">
              AuraCast
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.path 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.name}
                {currentPage === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">
                    Welcome, {user.name.split(' ')[0]}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('login')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('register')}
                  className="bg-gradient-primary hover:opacity-90 text-white shadow-aurora"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/20 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left py-2 text-sm font-medium transition-colors ${
                    currentPage === item.path 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 border-t border-border/20">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">
                        {user.name}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full hover:bg-destructive hover:text-destructive-foreground"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate('login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigate('register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-primary hover:opacity-90 text-white"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};