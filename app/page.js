'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/app/components/ui/Navbar';
import { 
  ArrowRight, 
  CheckCircle, 
  Heart, 
  Users, 
  Shield, 
  Menu,
  X,
  Flame,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Globe,
  Play,
  ZoomIn,
  Sparkles,
  Star,
  Zap,
  Crown,
  Target,
  BookOpen,
  Mic,
  Music,
  HandHeart,
  Church,
  Cross
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Image cards - only images, no titles or descriptions
  const heroImages = [
    {
      id: 1,
      image: '/images/worship.jpg',
      size: 'lg'
    },
    {
      id: 2,
      image: '/images/community.jpg',
      size: 'sm'
    },
    {
      id: 3,
      image: '/images/prayer.jpg',
      size: 'sm'
    },
    {
      id: 4,
      image: '/images/missions.jpg',
      size: 'md'
    },
    {
      id: 5,
      image: '/images/youth.jpg',
      size: 'md'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <main className="min-h-screen">
      <Navbar transparent={true} />
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-[#8A8C8E]/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ rotate: -10, scale: 1.05 }}
                className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0"
              >
                <Image
                  src="/images/logopng.png"
                  alt="Exousia Fellowship"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </motion.div>
              <span className="font-bold text-lg tracking-tight text-[#4A4C4E]">
                Exousia
                <span className="text-[#E51913] font-normal"> Fellowship Inc.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#home" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Home</a>
              <a href="#about" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">About</a>
              <a href="#ministries" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Ministry</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-[#4A4C4E]/70 hover:text-[#E51913] transition px-3 py-1.5 rounded-full hover:bg-[#F5F6F7]">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5 shadow-lg shadow-[#E51913]/25">
                Become a Partner
              </Link>
              <button 
                className="md:hidden p-2 hover:bg-[#F5F6F7] rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden glass border-t border-[#8A8C8E]/10">
            <div className="px-4 py-6 space-y-4">
              <a href="#home" className="block text-[#4A4C4E]/70 hover:text-[#E51913] transition">Home</a>
              <a href="#about" className="block text-[#4A4C4E]/70 hover:text-[#E51913] transition">About</a>
              <a href="#ministries" className="block text-[#4A4C4E]/70 hover:text-[#E51913] transition">Ministry</a>
            
              <Link href="/login" className="block text-[#4A4C4E]/70 hover:text-[#E51913] transition">Log in</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Modern Photo Grid */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Enhanced Background with Blue Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F6F7] to-[#FFFFFF] -z-10"></div>
        <div className="absolute top-[-30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-[#E51913]/5 blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#3BBCEB]/8 blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#E51913]/5 to-[#3BBCEB]/8 blur-3xl -z-10"></div>

        {/* Blue accent circles */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#3BBCEB]/5 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#3BBCEB]/5 blur-2xl"></div>

        {/* Animated floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#E51913' : '#3BBCEB',
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left Content - 2/5 */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E51913]/20 rounded-full px-4 py-1.5 text-sm font-medium text-[#4A4C4E] shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#E51913] animate-pulse"></span>
                Exousia Fellowship Inc. Partnership Program
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#4A4C4E]"
              >
                Partner with
                <span className="text-[#E51913] relative inline-block">
                   Exousia Fellowship
                  <motion.span
                    className="absolute -bottom-2 left-0 w-full h-1 bg-[#E51913]/30 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
                <br />
                <span className="text-[#4A4C4E]/70">in Ministry</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-[#4A4C4E]/60 max-w-lg leading-relaxed"
              >
                Join a community of faithful partners advancing the Gospel. Manage your contributions,
                track your giving, and stay connected with ministry updates — all in one elegant platform.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/register" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-[#E51913]/30 group">
                  Become a Partner
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
                <Link href="/learn-more" className="btn-outline text-base px-8 py-3.5">
                  Learn More
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-[#E51913]/20 to-[#3BBCEB]/20 flex items-center justify-center text-xs font-bold text-[#4A4C4E]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4A4C4E]">Thousands of Souls Won</p>
                  <p className="text-xs text-[#4A4C4E]/40">Transformed & Equipped for Jesus</p>
                </div>
                <div className="w-px h-8 bg-[#3BBCEB]/30"></div>
                <div>
                  <p className="text-sm font-medium text-[#4A4C4E]">120+ Nations</p>
                  <p className="text-xs text-[#4A4C4E]/40">Reached with the Gospel</p>
                </div>
              </motion.div>
            </div>

            {/* Right Content - 3/5 - Modern Photo Grid with Local Images - No Titles/Descriptions */}
            <motion.div
              className="lg:col-span-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[500px] md:h-[550px]">
                {/* Large Image - Top Left */}
                <motion.div
                  variants={cardVariants}
                  className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={heroImages[0].image}
                      alt="Exousia Fellowship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E51913]/60 via-[#E51913]/20 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Small Image - Top Right */}
                <motion.div
                  variants={cardVariants}
                  className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={heroImages[1].image}
                      alt="Exousia Fellowship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3BBCEB]/60 via-[#3BBCEB]/20 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Small Image - Top Right 2 */}
                <motion.div
                  variants={cardVariants}
                  className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={heroImages[2].image}
                      alt="Exousia Fellowship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E51913]/60 via-[#E51913]/20 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Medium Image - Bottom Left */}
                <motion.div
                  variants={cardVariants}
                  className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={heroImages[3].image}
                      alt="Exousia Fellowship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3BBCEB]/60 via-[#3BBCEB]/20 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Medium Image - Bottom Right */}
                <motion.div
                  variants={cardVariants}
                  className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <div className="w-full h-full relative">
                    <img
                      src={heroImages[4].image}
                      alt="Exousia Fellowship"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E51913]/60 via-[#E51913]/20 to-transparent"></div>
                  </div>
                </motion.div>
              </div>

              {/* Progress indicators with blue accent */}
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    className="group relative"
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === 0 ? 'w-8 bg-[#E51913]' : 'bg-[#3BBCEB]/30'
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E51913] via-[#3BBCEB] to-[#E51913]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-[#E51913] tracking-widest uppercase mb-3">About Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#4A4C4E]">
              One Family, One Mandate, One <span className="text-[#E51913]">Gospel</span> Together
            </h2>
            <p className="mt-4 text-[#4A4C4E]/60 text-lg">
              Exousia Fellowship is an interdenominational, prophetic evangelistic Christain ministry headquartered in Maiduguri, Borno State Nigeria.
              We exist to restore lives and proclaim Jesus Christ to the Nations. 
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card-premium p-8 text-center hover:border-[#E51913]/30"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#E51913]/10 flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-[#E51913]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4C4E]">Vision</h3>
              <p className="mt-2 text-[#4A4C4E]/60 text-sm leading-relaxed">
                To raise a generation empowered by divine authority (EXOUSIA), restoring lives, transforming mindsets
                and proclaiming the Gospel of Jesus Christ to the nations.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card-premium p-8 text-center hover:border-[#3BBCEB]/30"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#3BBCEB]/10 flex items-center justify-center mx-auto mb-5">
                <Users className="w-8 h-8 text-[#3BBCEB]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4C4E]">Our Pillars</h3>
              <p className="mt-2 text-[#4A4C4E]/60 text-sm leading-relaxed">
                Evangelism, Discipleship, Prophetic & Ambassadorial ministry, Mindset & Wisdom Teaching. Our Motto: <span className="text-[#E51913] font-semibold">"All Power Belongs to God"</span> points to EXOUSIA, the Greek word for divine authority and power.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card-premium p-8 text-center hover:border-[#E51913]/30"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#E51913]/10 flex items-center justify-center mx-auto mb-5">
                <Globe className="w-8 h-8 text-[#E51913]" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4C4E]">Mission</h3>
              <p className="mt-2 text-[#4A4C4E]/60 text-sm leading-relaxed">
                To spread the Gospel through prophetic evangelism, energetic discipleship, broadcast media, and
                community focused humanitarian initiatives.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section id="ministries" className="py-20 md:py-28 bg-[#F5F6F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-[#E51913] tracking-widest uppercase mb-3">Our Ministry's</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#4A4C4E]">
              Core <span className="text-[#E51913]">Values</span>
            </h2>
            <p className="mt-4 text-[#4A4C4E]/60 text-lg">
              The Conviction that Shapes how we Worship, Teach & Serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Heart className="w-6 h-6" />, title: 'Mindset Transformation', desc: 'Teaching practical wisdom for career growth, relationships & personal destiny.' },
              { icon: <Users className="w-6 h-6" />, title: 'Community & Empowerment', desc: 'Humanitarian outreach that restores dignity & hope where it is needed most.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Divine Authority & Faith', desc: 'Operating in Kingdom power _EXOUSIA_ as Ambassadors of Christ.' },
              { icon: <Flame className="w-6 h-6" />, title: 'Spiritual Mentorship & Lineage', desc: 'Walking in Honour and covering, raising disciples who raise disciples.' },
            ].map((ministry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 text-center hover:border-[#E51913]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E51913]/10 flex items-center justify-center mx-auto mb-4 text-[#E51913]">
                  {ministry.icon}
                </div>
                <h3 className="font-semibold text-[#4A4C4E]">{ministry.title}</h3>
                <p className="text-sm text-[#4A4C4E]/60 mt-2">{ministry.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 md:py-28 bg-[#4A4C4E] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A4C4E] to-[#2A2C2E]"></div>
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#E51913]/10 blur-3xl"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#3BBCEB]/10 blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-[#E51913] mb-3">Start Today</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Ready to make an <br className="sm:hidden" />
            <span className="text-[#E51913]">eternal impact?</span>
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-2xl mx-auto">
            Join hundreds of partners who are faithfully supporting the Gospel. Sign up in minutes.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-[#E51913] text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-[#C41712] transition shadow-xl shadow-[#E51913]/30 inline-flex items-center gap-2">
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/learn-more" className="border border-white/20 text-white/80 px-8 py-3.5 rounded-full font-medium text-base hover:bg-white/10 transition inline-flex items-center gap-2">
              Learn More
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/40">No credit card required · Free to join · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2C2E] text-white/50 border-t border-[#8A8C8E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-8 h-8">
                  <Image
                    src="/images/logopng.png"
                    alt="Exousia Fellowship"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <span className="text-white font-bold text-sm">Exousia Fellowship Inc</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs text-white/40">
                All Power Belongs to God. Raising a generation empowered by divine authority across the nations.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://www.facebook.com/PEHagin?locale=hy_AM" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#E51913] transition text-sm">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/elijahhagin/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#E51913] transition text-sm">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://www.youtube.com/@ExousiaTV" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#E51913] transition text-sm">
                  <span className="sr-only">YouTube</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Contact Us Section */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#E51913] mt-0.5" />
                  <span className="text-white/40">info@exousiafellowship.org</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#E51913] mt-0.5" />
                  <span className="text-white/40">+234 (703) 5996-162</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#E51913] mt-0.5" />
                  <span className="text-white/40">39 Commercial Layout, Damboa Road Maiduguri, Borno State Nigeria.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#home" className="hover:text-[#E51913] transition">Home</a></li>
                <li><a href="#about" className="hover:text-[#E51913] transition">About</a></li>
                <li><a href="#ministries" className="hover:text-[#E51913] transition">Ministries</a></li>
                <li><Link href="/learn-more" className="hover:text-[#E51913] transition">Learn More</Link></li>
                <li><Link href="/register" className="hover:text-[#E51913] transition">Become a Partner</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>&copy; 2026 Exousia Fellowship Incorporated. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-[#E51913] transition">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[#E51913] transition">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-[#E51913] transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}