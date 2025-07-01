
import Header from '../components/Header';
import { Heart, Users, MessageSquare, Calendar, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Community = () => {
  const posts = [
    {
      id: '1',
      author: 'Sarah Wilson',
      avatar: '/placeholder.svg',
      content: 'Just found the perfect playmate for Luna! Thanks to this amazing community 🐕❤️',
      likes: 24,
      comments: 8,
      timestamp: '2 hours ago',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      author: 'Mike Chen',
      avatar: '/placeholder.svg',
      content: 'Any recommendations for pet-friendly hiking trails in the Bay Area?',
      likes: 15,
      comments: 12,
      timestamp: '4 hours ago'
    }
  ];

  const events = [
    {
      id: '1',
      title: 'Dog Park Meetup',
      date: 'Tomorrow, 3:00 PM',
      location: 'Central Park',
      attendees: 12
    },
    {
      id: '2',
      title: 'Pet Care Workshop',
      date: 'This Weekend',
      location: 'Community Center',
      attendees: 8
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-32 w-80 h-80 bg-gradient-to-r from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-green-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Pet Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with fellow pet lovers, share experiences, and build lasting friendships in our vibrant community
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 relative z-10">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Share something with the community..."
                    className="flex-1 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <Button className="premium-gradient text-white px-6 py-3 h-auto">
                    Post ✨
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id} className="glass-card border-0 bg-white/40 backdrop-blur-lg hover:bg-white/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={`https://images.unsplash.com/photo-${post.id === '1' ? '1438761681033-6461ffad8d80' : '1507003211169-0a1dd7bf874e'}?w=150&h=150&fit=crop&auto=format`} 
                      alt={post.author} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/50" 
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{post.author}</h4>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                  
                  {post.image && (
                    <div className="mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${post.id === '1' ? '1601758228041-aaa1dd29b6e1' : '1583337130417-3346a1be7dee'}?w=600&h=300&fit=crop&auto=format`} 
                        alt="Post" 
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group">
                      <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors group">
                      <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{post.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 bg-white/50 rounded-xl border border-white/30 hover:bg-white/60 transition-colors">
                      <h4 className="font-bold text-gray-800 mb-2">{event.title}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-green-500" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-500" />
                          {event.attendees} attending
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg transition-all">
                        Join Event
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Popular Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Pet Training', 'Health Tips', 'Local Meetups', 'Breed Info', 'Nutrition', 'Grooming'].map((topic) => (
                    <span 
                      key={topic} 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Members</span>
                    <span className="font-bold text-blue-600">2,347</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="font-bold text-green-600">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Events</span>
                    <span className="font-bold text-purple-600">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
