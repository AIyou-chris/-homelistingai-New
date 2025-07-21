// Main sales/landing page for the product
import { useState } from "react";
import { Check, Star, Zap, Shield, HelpCircle, ArrowRight, Menu, X, Rocket, Target, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import ImageWithFallback from "@/components/ImageWithFallback";

const SalesPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: "#features", label: "Features" },
        { href: "#how-it-works", label: "How It Works" },
        { href: "#pricing", label: "Pricing" },
        { href: "#testimonials", label: "Testimonials" },
        { href: "#faq", label: "FAQ" },
    ];

    return (
        <div className="bg-gray-50 text-gray-800">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 shadow-sm">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-gray-900">
                        HomeListing<span className="text-blue-600">AI</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost" asChild>
                            <Link to="/login">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/new-signup">Start Your Free Listing</Link>
                        </Button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden bg-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <nav className="flex flex-col items-center space-y-4 py-4">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-blue-600 transition-colors">
                                    {link.label}
                                </a>
                            ))}
                            <Button variant="ghost" asChild>
                                <Link to="/login">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/new-signup">Start Your Free Listing</Link>
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </header>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="py-20 md:py-32 text-center bg-white">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                Craft the Perfect Real Estate Listing, <br />
                                <span className="text-blue-600">Powered by AI</span>
                            </h1>
                            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                                Stop guessing what buyers want to hear. Our AI analyzes your property and market data to generate compelling listings that sell faster.
                            </p>
                            <p className="mt-4 text-sm text-purple-600 font-semibold">
                                🔥 See the full power: AI analytics, lead tracking, automated follow-ups, and so much more!
                            </p>
                            <div className="mt-10 flex justify-center items-center space-x-4">
                                <Button size="lg" asChild>
                                    <Link to="/new-signup">Start Your Free Listing</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="border-purple-600 text-purple-600 hover:bg-purple-50 shadow-lg transform hover:scale-105 transition-all">
                                    <Link to="/demo">
                                        Try the Demo App! 🔥 <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            className="mt-16"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <ImageWithFallback
                                src="/placeholder.svg"
                                fallbackSrc="https://via.placeholder.com/1200x600"
                                alt="Dashboard preview"
                                className="rounded-lg shadow-2xl mx-auto"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose HomeListingAI?</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Our platform is packed with features designed to make your listings shine and your job easier.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Rocket className="h-8 w-8 text-blue-600" />,
                                    title: "AI-Powered Descriptions",
                                    description: "Generate compelling, SEO-friendly property descriptions in seconds.",
                                },
                                {
                                    icon: <Target className="h-8 w-8 text-blue-600" />,
                                    title: "Targeted Buyer Insights",
                                    description: "Understand what motivates buyers in your market with our data-driven insights.",
                                },
                                {
                                    icon: <BarChart2 className="h-8 w-8 text-blue-600" />,
                                    title: "Performance Analytics",
                                    description: "Track your listing's performance and get suggestions for improvement.",
                                },
                                {
                                    icon: <Zap className="h-8 w-8 text-blue-600" />,
                                    title: "Instant Lead Alerts",
                                    description: "Never miss a potential buyer with instant notifications on your devices.",
                                },
                                {
                                    icon: <Shield className="h-8 w-8 text-blue-600" />,
                                    title: "Secure Document Handling",
                                    description: "Manage all your property documents in one secure, centralized location.",
                                },
                                {
                                    icon: <HelpCircle className="h-8 w-8 text-blue-600" />,
                                    title: "24/7 AI Assistant",
                                    description: "Get answers to your real estate questions anytime with our knowledgeable AI.",
                                },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <div className="bg-blue-100 p-3 rounded-full w-max mb-4">
                                                {feature.icon}
                                            </div>
                                            <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get Started in 3 Simple Steps</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">From property details to a polished listing in minutes.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                                {
                                    step: 1,
                                    title: "Upload Property Info",
                                    description: "Provide basic details, photos, and any relevant documents about your property.",
                                    image: "/placeholder.svg"
                                },
                                {
                                    step: 2,
                                    title: "AI Generation",
                                    description: "Our AI analyzes your data and generates multiple listing drafts and marketing ideas.",
                                    image: "/placeholder.svg"
                                },
                                {
                                    step: 3,
                                    title: "Publish & Dominate",
                                    description: "Choose the best version, make any final tweaks, and publish your high-impact listing.",
                                    image: "/placeholder.svg"
                                }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <div className="p-2">
                                        <ImageWithFallback
                                            src={item.image}
                                            fallbackSrc="https://via.placeholder.com/400x300"
                                            alt={item.title}
                                            className="rounded-lg shadow-lg mb-6"
                                        />
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Step {item.step}: {item.title}</h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Loved by Agents Everywhere</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what real estate professionals are saying.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "This tool is a game-changer. I'm saving hours on every listing, and my client feedback has been incredible.",
                                    author: "Sarah J., Realtor",
                                    avatar: "/placeholder.svg"
                                },
                                {
                                    quote: "The AI-generated descriptions are better than what I could write myself. My listings are getting more views than ever.",
                                    author: "Mike R., Broker",
                                    avatar: "/placeholder.svg"
                                },
                                {
                                    quote: "I was skeptical at first, but HomeListingAI has become an indispensable part of my workflow. Highly recommended!",
                                    author: "Emily W., Agent",
                                    avatar: "/placeholder.svg"
                                }
                            ].map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                >
                                    <Card className="h-full flex flex-col">
                                        <CardContent className="pt-6 flex-grow">
                                            <div className="flex items-center mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                                ))}
                                            </div>
                                            <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                                        </CardContent>
                                        <div className="p-6 pt-0 flex items-center">
                                            <ImageWithFallback src={testimonial.avatar} fallbackSrc="https://via.placeholder.com/40" alt={testimonial.author} className="w-10 h-10 rounded-full mr-4" />
                                            <span className="font-semibold text-gray-900">{testimonial.author}</span>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
                            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Choose the plan that's right for you. Cancel anytime.</p>
                        </div>
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5 }}
                                className="w-full max-w-md"
                            >
                                <Card className="border-2 border-blue-600 shadow-2xl">
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl font-bold">Professional Plan</CardTitle>
                                        <p className="text-4xl font-extrabold my-4">$59<span className="text-lg font-normal text-gray-600">/listing</span></p>
                                        <p className="text-gray-600">Pay only for the listings you want AI on. Cancel anytime.</p>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4">
                                            {[
                                                "Unlimited AI-powered listings",
                                                "Advanced performance analytics",
                                                "Targeted buyer persona insights",
                                                "Priority email support",
                                                "Secure document storage (up to 50GB)"
                                            ].map((feature) => (
                                                <li key={feature} className="flex items-center">
                                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                                    <span className="text-gray-800">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button size="lg" className="w-full mt-8" asChild>
                                            <Link to="/checkout">Choose Professional</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20 md:py-24">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
                            <p className="mt-4 text-lg text-gray-600">Have questions? We have answers.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {[
                                {
                                    question: "Is there a learning curve?",
                                    answer: "Not at all! Our interface is designed to be intuitive and user-friendly. Most agents are creating amazing listings within minutes of signing up. We also provide tutorials and support to help you get started."
                                },
                                {
                                    question: "Can I use this for any type of property?",
                                    answer: "Yes, our AI is trained on a massive dataset of property types, from single-family homes and condos to commercial real estate and land. It can generate effective listings for virtually any property."
                                },
                                {
                                    question: "What if I'm not happy with the AI-generated content?",
                                    answer: "While our AI is incredibly advanced, you always have the final say. You can easily edit any generated text, regenerate options, or use our AI Writing Assistant to refine specific parts of your listing."
                                },
                                {
                                    question: "How does the free trial work?",
                                    answer: "Your 14-day free trial gives you full access to all features of the Professional Plan. You can create unlimited listings and see the power of HomeListingAI for yourself. No credit card is required to start."
                                }
                            ].map((item, index) => (
                                <AccordionItem value={`item-${index + 1}`} key={index}>
                                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-32 bg-blue-600 text-white text-center">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold">Ready to Supercharge Your Listings?</h2>
                            <p className="mt-6 text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
                                Join hundreds of successful agents who are closing deals faster with the power of AI.
                            </p>
                            <div className="mt-10">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link to="/new-signup">Start Your Free Listing Today</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold">HomeListingAI</h3>
                            <p className="mt-2 text-gray-400">AI-Powered Real Estate Listings.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Quick Links</h3>
                            <ul className="mt-4 space-y-2">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Legal</h3>
                            <ul className="mt-4 space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Contact</h3>
                            <p className="mt-4 text-gray-400">contact@homelistingai.com</p>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
                        <p>&copy; {new Date().getFullYear()} HomeListingAI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SalesPage;