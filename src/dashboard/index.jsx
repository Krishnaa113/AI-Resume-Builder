import AddResume from './components/AddResume'
import GlobalAPi from './../../service/GlobalAPi';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import ResumeItem from './components/ResumeItem';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star,
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Share2,
  Home,
  User,
  Bell,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { NavLink, useLocation } from 'react-router-dom';

function Dashboard() { 
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filteredResumes, setFilteredResumes] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      GetUserResumesList();
    }
  }, [user]);

  useEffect(() => {
    // Filter resumes based on search term
    const filtered = resumeList.filter(resume =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResumes(filtered);
  }, [resumeList, searchTerm]);

  const GetUserResumesList = () => {
    setLoading(true);
 GlobalAPi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
      .then(resp => {
  setResumeList(resp.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await GlobalAPi.DeleteResume(resumeId);
      setResumeList(prevList => prevList.filter(resume => resume.documentId !== resumeId));
      toast.success("Resume deleted successfully!");
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  const stats = [
    {
      icon: <FileText className="w-6 h-6" />,
      label: "Total Resumes",
      value: resumeList.length,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "This Month",
      value: resumeList.filter(r => {
        const created = new Date(r.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Recently Updated",
      value: resumeList.filter(r => {
        const updated = new Date(r.updatedAt);
        const now = new Date();
        const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }).length,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: "Completed",
      value: resumeList.length, // In a real app, you'd check completion status
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Glassy Dashboard Header */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 font-medium text-gray-600 hover:text-blue-600 transition-colors relative ${isActive ? 'text-blue-600' : ''}`
                }
              >
                <Home className="w-5 h-5" />
                Home
                {location.pathname === '/' && (
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 font-medium text-gray-600 hover:text-blue-600 transition-colors relative ${isActive ? 'text-blue-600' : ''}`
                }
              >
                <FileText className="w-5 h-5" />
                Dashboard
                {location.pathname === '/dashboard' && (
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
              </NavLink>
            </nav>
            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
                  </p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready to build something amazing!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Resume</span>
              <br />
              Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, manage, and share your professional resumes with ease. 
              Everything you need to land your dream job is right here.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center text-white mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Search and Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-md"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2 rounded-md"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading your resumes...
              </div>
            </div>
          ) : (
            <>
              {filteredResumes.length === 0 && searchTerm ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or create a new resume.</p>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  <AddResume onResumeCreated={GetUserResumesList} />
                  {filteredResumes.map((resume, index) => (
                    <div
                      key={resume.documentId}
                      className="animate-in slide-in-from-bottom-4"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <ResumeItem 
                        resume={resume} 
                        onDelete={handleDeleteResume}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Empty State */}
        {!loading && resumeList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Your First Resume</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building your professional resume today. Our AI-powered builder will help you create a stunning resume that gets you noticed.
            </p>
            {/* Removed Create Resume and Import Resume buttons */}
          </div>
        )}
       </div>
     </div>
  );
}

export default Dashboard;