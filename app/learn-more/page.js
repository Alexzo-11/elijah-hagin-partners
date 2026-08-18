'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Heart,
  Users,
  Globe,
  Shield,
  Flame,
  BookOpen,
  Cross,
  Church,
  Mic,
  Music,
  HandHeart,
  Target,
  Crown,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Home
} from 'lucide-react';

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Navigation Bar */}
      <header className="glass border-b border-[#8A8C8E]/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
                <Image
                  src="/images/logopng.png"
                  alt="Exousia Fellowship"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#4A4C4E]">
                Exousia
                <span className="text-[#E51913] font-normal"> Partners Inc.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Home</Link>
              <a href="#about" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">About</a>
              <a href="#ministries" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Ministries</a>
              <a href="#cta" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Get Started</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-[#4A4C4E]/70 hover:text-[#E51913] transition px-3 py-1.5 rounded-full hover:bg-[#F5F6F7]">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5 shadow-lg shadow-[#E51913]/25">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F6F7] to-[#FFFFFF] -z-10"></div>
        <div className="absolute top-[-30%] right-[-15%] w-[500px] h-[500px] rounded-full bg-[#E51913]/5 blur-3xl -z-10"></div>
        <div className="absolute bottom-[-30%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#3BBCEB]/5 blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-[#E51913] tracking-widest uppercase mb-3">About Exousia</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4A4C4E]">
              Learn More About <span className="text-[#E51913]">Our Ministry</span>
            </h1>
            <p className="mt-4 text-lg text-[#4A4C4E]/60 max-w-2xl mx-auto">
              Discover the vision, mission, and values that drive Exousia Fellowship Incorporated.
            </p>
            <Link href="/" className="btn-outline text-sm mt-8 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="about" className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4C4E]">Who <span className="text-[#E51913]">We Are</span></h2>
            <div className="w-20 h-1 bg-[#E51913] mx-auto mt-4"></div>
          </div>

          <div className="prose prose-lg max-w-none text-[#4A4C4E]">
            <p className="text-lg leading-relaxed">
              <span className="font-bold text-[#E51913]">Exousia Fellowship Incorporated</span> is an interdenominational, 
              prophetic evangelistic Christian ministry headquartered in Maiduguri, Borno State, Nigeria. 
              We are a community of believers united by our love for Christ and our passion to see lives transformed by the power of the Gospel.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Our name, <span className="font-bold text-[#E51913]">EXOUSIA</span>, is derived from the Greek word for 
              <span className="font-bold"> divine authority and power</span>. We believe that every believer has been given 
              authority in Christ to advance the Kingdom of God and make a lasting impact in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: <Church className="w-8 h-8" />, title: 'Interdenominational', desc: 'We unite believers from all denominational backgrounds.' },
              { icon: <Cross className="w-8 h-8" />, title: 'Christ-Centered', desc: 'Jesus Christ is the foundation and focus of our ministry.' },
              { icon: <Globe className="w-8 h-8" />, title: 'Global Reach', desc: 'We are committed to reaching nations with the Gospel.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 text-center hover:border-[#E51913]/30 transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#E51913]/10 flex items-center justify-center mx-auto mb-4 text-[#E51913]">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#4A4C4E]">{item.title}</h3>
                <p className="text-sm text-[#4A4C4E]/60 mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section id="vision" className="py-16 md:py-20 bg-[#F5F6F7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4C4E]">Our <span className="text-[#E51913]">Foundation</span></h2>
            <div className="w-20 h-1 bg-[#E51913] mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Vision',
                desc: 'To raise a generation empowered by divine authority (EXOUSIA), restoring lives, transforming mindsets and proclaiming the Gospel of Jesus Christ to the nations.',
                color: '#E51913'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Mission',
                desc: 'To spread the Gospel through prophetic evangelism, energetic discipleship, broadcast media, and community focused humanitarian initiatives.',
                color: '#3BBCEB'
              },
              {
                icon: <Crown className="w-8 h-8" />,
                title: 'Core Values',
                desc: 'Mindset Transformation, Community Empowerment, Divine Authority & Faith, and Spiritual Mentorship & Lineage.',
                color: '#E51913'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-8 text-center hover:shadow-xl transition-all"
                style={{ borderColor: index === 1 ? '#3BBCEB30' : '#E5191330' }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#4A4C4E]">{item.title}</h3>
                <p className="mt-2 text-[#4A4C4E]/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Ministries */}
      <section id="ministries" className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4C4E]">Our <span className="text-[#E51913]">Ministries</span></h2>
            <div className="w-20 h-1 bg-[#E51913] mx-auto mt-4"></div>
            <p className="mt-4 text-[#4A4C4E]/60">The core pillars that define our ministry approach.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: <Flame className="w-6 h-6" />, title: 'Mindset Transformation', desc: 'Teaching practical wisdom for career growth, relationships, and personal destiny through the lens of Scripture.' },
              { icon: <Users className="w-6 h-6" />, title: 'Community & Empowerment', desc: 'Humanitarian outreach that restores dignity and hope where it is needed most in our communities.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Divine Authority & Faith', desc: 'Operating in Kingdom power (EXOUSIA) as Ambassadors of Christ, demonstrating God\'s love and power.' },
              { icon: <BookOpen className="w-6 h-6" />, title: 'Spiritual Mentorship & Lineage', desc: 'Walking in Honour and covering, raising disciples who raise disciples for the Kingdom.' },
            ].map((ministry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium p-6 hover:border-[#E51913]/30 transition-all flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E51913]/10 flex items-center justify-center flex-shrink-0 text-[#E51913]">
                  {ministry.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-[#4A4C4E]">{ministry.title}</h4>
                  <p className="text-sm text-[#4A4C4E]/60 mt-1">{ministry.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Motto */}
      <section className="py-16 md:py-20 bg-[#4A4C4E] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A4C4E] to-[#2A2C2E]"></div>
        <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#E51913]/10 blur-3xl"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#3BBCEB]/10 blur-3xl"></div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Sparkles className="w-12 h-12 text-[#E51913] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-[#E51913]">All Power</span> Belongs to God
          </h2>
          <p className="text-white/70 text-lg mt-4">
            Our motto reflects the heart of EXOUSIA — the divine authority and power given to every believer to advance the Kingdom of God.
          </p>
          <div className="mt-6 flex justify-center gap-6 flex-wrap">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Acts 1:8</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Matthew 28:18-20</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm">Luke 10:19</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#4A4C4E]">Join the <span className="text-[#E51913]">Movement</span></h2>
          <p className="mt-4 text-[#4A4C4E]/60 text-lg">
            Become a partner in advancing the Gospel. Together, we can make an eternal impact.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-[#E51913]/30 inline-flex items-center gap-2">
              Become a Partner
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="btn-outline text-base px-8 py-3.5 inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
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
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/" className="hover:text-[#E51913] transition">Home</Link></li>
                <li><Link href="/learn-more#about" className="hover:text-[#E51913] transition">About</Link></li>
                <li><Link href="/learn-more#ministries" className="hover:text-[#E51913] transition">Ministries</Link></li>
                <li><Link href="/register" className="hover:text-[#E51913] transition">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#E51913] mt-0.5 flex-shrink-0" />
                  <span className="text-white/40">info@exousiafellowship.org</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#E51913] mt-0.5 flex-shrink-0" />
                  <span className="text-white/40">+234 (703) 5996-162</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>&copy; 2026 Exousia Fellowship Incorporated. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#E51913] transition">Privacy Policy</a>
              <a href="#" className="hover:text-[#E51913] transition">Terms of Service</a>
              <a href="#" className="hover:text-[#E51913] transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}