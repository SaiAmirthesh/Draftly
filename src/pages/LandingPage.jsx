import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Zap, Sparkles, Send, Shield, MousePointer2, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import Plasma from '../components/Plasma';
import logo from '../assets/design-tool.png'

const features = [
    {
        title: "Intelligent Drafting",
        description: "Generate emails based on context, tone, and recipient. Never start from a blank page again.",
        icon: <Zap className="w-6 h-6" />
    },
    {
        title: "Tone Adjustment",
        description: "Choose from professional, casual, or persuasive tones to match any situation perfectly.",
        icon: <Sparkles className="w-6 h-6" />
    },
    {
        title: "One-Click Refinement",
        description: "Already have a draft? Let our AI polish it for better clarity, impact, and grammar.",
        icon: <Send className="w-6 h-6" />
    }
];

const steps = [
    {
        title: "Input Context",
        description: "Tell Draftly who you're writing to and what the key points are."
    },
    {
        title: "AI Generation",
        description: "Our advanced model drafts a personalized, high-impact email in seconds."
    },
    {
        title: "Refine & Send",
        description: "Tweak the tone or polish the content with one click, then copy and send."
    }
];

const LandingPage = () => {
    return (
        <div className="bg-background text-foreground min-h-screen font-sans selection:bg-primary/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                            <img src={logo} alt="logo" className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Draftly</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
                        <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition-all hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    {/* Background Plasma */}
                    <div className="absolute top-0 left-0 w-full h-[600px] z-0 opacity-40 dark:opacity-60 pointer-events-none">
                        <Plasma
                            color="#7c35ffff"
                            speed={0.6}
                            direction="forward"
                            scale={1.1}
                            opacity={0.8}
                            mouseInteractive={true}
                        />
                    </div>

                    {/* Original Background Gradients (Kept for depth) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10" />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-wider">
                                <Sparkles className="w-3 h-3" />
                                AI-Powered Email Intelligence
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                                Stop Writing Emails.<br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary">Start Drafting Success.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                                Draftly uses advanced AI to craft perfect emails in seconds.
                                Whether it's a cold pitch or a formal follow-up, we've got you covered.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    Try Draftly for Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <a
                                    href="#features"
                                    className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg hover:bg-secondary/80 transition-all border border-border"
                                >
                                    Explore Features
                                </a>
                            </div>

                            {/* Social Proof / Dashboard Preview */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="mt-20 relative"
                            >
                                <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full scale-90 opacity-50" />
                                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 md:p-8 shadow-2xl overflow-hidden">
                                    <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                        <div className="space-y-4">
                                            <div className="h-8 bg-muted/40 rounded-md w-3/4" />
                                            <div className="h-4 bg-muted/30 rounded-md w-full" />
                                            <div className="h-4 bg-muted/30 rounded-md w-5/6" />
                                            <div className="h-32 bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-center justify-center italic text-muted-foreground">
                                                "Draftly helped me land my dream internship with a perfectly tailored cold email."
                                            </div>
                                        </div>
                                        <div className="hidden md:block space-y-4">
                                            <div className="flex gap-2">
                                                <div className="h-10 bg-primary/20 rounded-lg w-1/2" />
                                                <div className="h-10 bg-muted/20 rounded-lg w-1/2" />
                                            </div>
                                            <div className="h-40 bg-card border border-border/50 rounded-lg p-4 font-mono text-xs opacity-60">
                                                Subject: Collaboration Opportunity<br /><br />
                                                Dear Alex,<br />
                                                I've been following your work at TechFlow...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything You Need to <span className="text-primary">Send Better.</span></h2>
                            <p className="text-muted-foreground text-lg">Powerful features to streamline your communication.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats / Proof Section */}
                <section className="py-20 border-y border-border/40">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Accuracy</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Emails Sent</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">5x</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Faster Work</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">Zero</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Stress</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="bg-secondary/10 relative overflow-hidden max-w-screen mx-auto py-24">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground text-lg">Simple steps to start your journey</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="p-12 rounded-3xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-700" />
                            <div className="relative z-10">
                                <h2 className="text-4xl font-bold mb-6">Ready to transform your inbox?</h2>
                                <p className="text-lg opacity-90 mb-10 max-w-xl mx-auto font-medium">
                                    Join thousands of professionals who are saving hours every week with Draftly's AI assistant.
                                </p>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-xl"
                                >
                                    Get Started for Free
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-16 border-t border-border/40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">Draftly</span>
                            </div>
                            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                                Draftly is building the future of communication.
                                We enable everyone to write professional, effective emails instantly.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 bg-secondary rounded-lg hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="p-2 bg-secondary rounded-lg hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                                <a href="#" className="p-2 bg-secondary rounded-lg hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Product</h4>
                            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">AI Engine</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-muted-foreground text-sm font-medium">
                                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/20 text-center text-sm text-muted-foreground font-medium">
                        © {new Date().getFullYear()} Draftly.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;