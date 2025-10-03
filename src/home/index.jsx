import React, { useState } from 'react';
import Header from '../components/custom/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  FileText, 
  Download, 
  Share2, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Zap,
  Shield,
  Globe,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Home() {
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("Welcome! Redirecting to dashboard...");
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Resume Builder",
      description: "Create professional resumes with intelligent suggestions and formatting"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Easy Download & Share",
      description: "Download your resume in multiple formats and share with anyone"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We never share your information"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Professional Templates",
      description: "Choose from multiple professional templates designed for success"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Quick & Easy",
      description: "Build your resume in minutes, not hours. Simple step-by-step process"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "ATS Optimized",
      description: "Resumes optimized for Applicant Tracking Systems to get you noticed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Resume Builder
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Professional Resume</span>
              <br />
              in Minutes
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build stunning, ATS-optimized resumes that get you noticed. 
              Professional templates, AI suggestions, and easy sharing - all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <form onSubmit={handleGetStarted} className="flex w-full max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email to get started"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none"
                />
                <Button 
                  type="submit"
                  className="rounded-l-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started Free
                </Button>
              </form>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
        {/* Hero Image/Preview */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Krishn Jha</h3>
                <div className="text-sm text-gray-600">Software Engineer</div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p>📧 kjha24760@gmail.com | 📱 9818046831</p>
                <p>📍 New Delhi,Delhi | 🔗 https://www.linkedin.com/in/krishna-jha-a82ba8280/</p>
                <div className="border-t pt-3">
                  <p className="font-medium text-gray-800 mb-2">Professional Summary</p>
                  <p>Fresher, try to gain real-world experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build the Perfect Resume
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive resume builder includes all the tools and features you need to create a professional resume that stands out.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start creating your professional resume today with our easy-to-use builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/sign-in">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Resume Builder</h3>
              <p className="text-gray-400 mb-4">
                Create professional resumes that get you noticed. AI-powered suggestions and beautiful templates.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/in/krishna-jha-a82ba8280/" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/Krishnaa113" className="text-gray-400 hover:text-white">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;