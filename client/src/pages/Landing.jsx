import { Link } from 'react-router-dom'
import {
  Church,
  Users,
  Megaphone,
  HandCoins,
  Wallet,
  BarChart3,
  Bell,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description:
        'Register and organize church members by groups and fellowships with complete contact details.',
      gradient: 'from-blue-400 to-blue-600',
      glow: 'shadow-blue-500/30',
    },
    {
      icon: Megaphone,
      title: 'Pledge Campaigns',
      description:
        'Create fundraising campaigns with targets and deadlines. Track progress in real-time.',
      gradient: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-500/30',
    },
    {
      icon: HandCoins,
      title: 'Pledge Tracking',
      description:
        'Assign pledges to members and monitor fulfillment status — pending, partial, or completed.',
      gradient: 'from-amber-400 to-amber-600',
      glow: 'shadow-amber-500/30',
    },
    {
      icon: Wallet,
      title: 'Payment Recording',
      description:
        'Record collections via cash, mobile money, bank transfer, or cheque with instant balance updates.',
      gradient: 'from-emerald-400 to-emerald-600',
      glow: 'shadow-emerald-500/30',
    },
    {
      icon: BarChart3,
      title: 'Reports & Exports',
      description:
        'Generate comprehensive reports and export to Excel or PDF with one click.',
      gradient: 'from-red-400 to-red-600',
      glow: 'shadow-red-500/30',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description:
        'Send payment reminders and confirmations via SMS, email, or in-app messages.',
      gradient: 'from-cyan-400 to-cyan-600',
      glow: 'shadow-cyan-500/30',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Register Members',
      description:
        'Add your congregation with their contact details and assign them to groups.',
    },
    {
      number: '02',
      title: 'Create Campaigns',
      description:
        'Launch pledge campaigns with target amounts and set individual member commitments.',
    },
    {
      number: '03',
      title: 'Track & Collect',
      description:
        'Record payments as they arrive and watch your collection rate climb in real-time.',
    },
  ]

  const demoAccounts = [
    {
      role: 'Admin',
      email: 'admin@church.com',
      password: 'Admin@123',
      badge: 'Full Access',
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      role: 'Pastor',
      email: 'pastor@church.com',
      password: 'Pastor@123',
      badge: 'View + Reports',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      role: 'Treasurer',
      email: 'treasurer@church.com',
      password: 'Treasurer@123',
      badge: 'Pledges + Collections',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      role: 'Member',
      email: 'member@church.com',
      password: 'Member@123',
      badge: 'Limited Access',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
  ]

  const techStats = [
    { icon: Zap, label: 'Fast', value: 'Vite + React' },
    { icon: Shield, label: 'Secure', value: 'JWT + bcrypt' },
    { icon: Users, label: 'Scalable', value: 'Cloud hosted' },
    { icon: BarChart3, label: 'Insightful', value: 'Real-time data' },
  ]

  const techList = [
    'Node.js + Express',
    'MongoDB Atlas',
    'React 18 + Vite',
    'Tailwind CSS',
    'JWT Authentication',
    'ExcelJS + PDFKit',
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ===== Navigation ===== */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg shadow-sm shadow-primary-500/30">
                <Church className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-secondary-800">Church Pledge</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary text-sm px-4 py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-72 h-72 bg-secondary-300/30 rounded-full blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-primary-100 shadow-sm text-primary-700 rounded-full text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                Trusted by growing congregations
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-secondary-900 leading-[1.05] tracking-tight mb-6">
                Every pledge.
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary-500 via-primary-600 to-amber-500 bg-clip-text text-transparent">
                    Fully accounted for.
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9 C 80 2, 220 2, 298 9"
                      stroke="#fbbf24"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-secondary-600 mb-8 max-w-xl">
                Track member commitments, record collections, generate reports, and send reminders, all from one powerful platform built for churches.
              </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white overflow-hidden shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 transition-transform duration-300 group-hover:scale-105" />
                  <span className="relative">Get Started Free</span>
                  <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl blur-3xl opacity-20" />

              {/* Floating badge — top left */}
              <div className="hidden sm:flex absolute -top-5 -left-5 z-20 items-center gap-2 bg-white rounded-xl shadow-lg border border-secondary-100 px-3.5 py-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary-800">UGX 1.9M</p>
                  <p className="text-[10px] text-secondary-400">collected this month</p>
                </div>
              </div>

              {/* Floating badge — bottom right */}
              <div className="hidden sm:block absolute -bottom-5 -right-5 z-20 bg-white rounded-xl shadow-lg border border-secondary-100 px-3.5 py-2.5">
                <p className="text-xs text-secondary-400 mb-0.5">Collection rate</p>
                <p className="text-lg font-bold text-primary-600">68%</p>
              </div>

              <div className="glass-card relative !p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm shadow-primary-500/30">
                      AU
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-secondary-800">Admin User</p>
                      <p className="text-xs text-secondary-400">admin@church.com</p>
                    </div>
                  </div>
                  <span className="badge badge-success">Live</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white/70 rounded-lg border border-white/60">
                    <p className="text-xs text-primary-700 mb-1">Pledged</p>
                    <p className="text-lg font-bold text-primary-800">UGX 2.8M</p>
                  </div>
                  <div className="p-3 bg-white/70 rounded-lg border border-white/60">
                    <p className="text-xs text-emerald-700 mb-1">Collected</p>
                    <p className="text-lg font-bold text-emerald-800">UGX 1.9M</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-secondary-500 mb-2">Collection Progress</p>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <p className="text-xs text-secondary-500 mt-1 text-right">68%</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/60">
                    <div className="w-6 h-6 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <Wallet className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-secondary-700">John Doe paid</p>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600">+50,000</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/60">
                    <div className="w-6 h-6 shrink-0 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <Wallet className="w-3 h-3 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-secondary-700">Mary Jane paid</p>
                    </div>
                    <p className="text-xs font-semibold text-emerald-600">+100,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium mb-4">
              FEATURES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Everything Your Church Needs
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              A complete toolkit for managing church finances, pledges, and member commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.glow} items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium mb-4">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Get up and running in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-2xl text-xl font-bold mb-6 shadow-lg shadow-primary-500/30">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-800 mb-3">{step.title}</h3>
                  <p className="text-secondary-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-primary-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Demo Credentials ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium mb-4">
              TRY IT OUT
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Demo Accounts
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explore the system with these pre-seeded accounts. Each role has different permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {demoAccounts.map((account, index) => (
    <div key={index} className="glass-card !p-5">
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="font-bold text-secondary-800 text-lg">{account.role}</h3>
        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${account.badgeColor}`}>
          {account.badge}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wide mb-0.5">
            Email
          </p>
          <p className="text-secondary-700 break-all">{account.email}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-secondary-400 uppercase tracking-wide mb-0.5">
            Password
          </p>
          <p className="text-secondary-700">{account.password}</p>
        </div>
      </div>
    </div>
  ))}
</div>
          <div className="text-center mt-10">
            <Link to="/login" className="btn btn-primary text-base px-6 py-3">
              Sign In to Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Tech Stack / About ===== */}
      <section className="py-20 bg-gradient-to-br from-secondary-900 to-secondary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium mb-4">
                <Shield className="w-3.5 h-3.5" />
                Built with modern tech
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Production-Ready Architecture
              </h2>
              <p className="text-secondary-300 mb-6">
                Built with the MERN stack approach — MongoDB, Express, React, and Node.js. Secure JWT authentication, bcrypt password hashing, role-based access control, and RESTful APIs.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {techList.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-secondary-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {tech}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {techStats.map((stat, index) => (
                <div key={index} className="p-6 bg-white/5 backdrop-blur rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                    <stat.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <p className="text-sm text-secondary-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-8 bg-secondary-900 border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg">
                <Church className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm text-secondary-400">
                © {new Date().getFullYear()} Church Pledge Management System
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-secondary-400">
              <Link to="/login" className="hover:text-white transition">Sign In</Link>
              <Link to="/register" className="hover:text-white transition">Register</Link>
              <a href="https://github.com/Becky-234/Church-Pledge-System" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing