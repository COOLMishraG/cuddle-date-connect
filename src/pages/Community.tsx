
import Header from '@/components/Header';
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
    <div className="min-h-screen bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes - Enhanced with more emojis */}
      <div className="floating-shape absolute top-[7%] left-[15%] text-4xl float-1">💕</div>
      <div className="floating-shape absolute top-[18%] right-[12%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[15%] left-[23%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[35%] left-[8%] text-2xl float-1" style={{ animationDelay: '2s' }}>🏠</div>
      <div className="floating-shape absolute bottom-[35%] right-[15%] text-3xl float-2" style={{ animationDelay: '3s' }}>🐩</div>
      <div className="floating-shape absolute top-[50%] right-[25%] text-4xl float-3" style={{ animationDelay: '1s' }}>💖</div>
      <div className="floating-shape absolute bottom-[5%] left-[30%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐕</div>

      {/* Additional floating emojis for community page */}
      <div className="floating-shape absolute top-[12%] left-[65%] text-3xl float-2" style={{ animationDelay: '1.5s' }}>👥</div>
      <div className="floating-shape absolute top-[65%] left-[12%] text-2xl float-3" style={{ animationDelay: '2.5s' }}>💬</div>
      <div className="floating-shape absolute bottom-[45%] left-[80%] text-4xl float-1" style={{ animationDelay: '3.5s' }}>🎉</div>
      <div className="floating-shape absolute top-[80%] right-[45%] text-3xl float-2" style={{ animationDelay: '0.5s' }}>🤝</div>
      <div className="floating-shape absolute top-[25%] left-[55%] text-2xl float-3" style={{ animationDelay: '4.5s' }}>📱</div>
      <div className="floating-shape absolute bottom-[60%] right-[8%] text-5xl float-1" style={{ animationDelay: '1.8s' }}>💙</div>
      <div className="floating-shape absolute top-[85%] left-[35%] text-3xl float-2" style={{ animationDelay: '3.2s' }}>🌟</div>
      <div className="floating-shape absolute bottom-[8%] right-[60%] text-2xl float-3" style={{ animationDelay: '2.8s' }}>📅</div>
      <div className="floating-shape absolute top-[22%] left-[42%] text-4xl float-1" style={{ animationDelay: '4.2s' }}>🏆</div>
      <div className="floating-shape absolute bottom-[28%] left-[5%] text-3xl float-2" style={{ animationDelay: '0.8s' }}>🎈</div>
      <div className="floating-shape absolute top-[62%] right-[35%] text-2xl float-3" style={{ animationDelay: '3.8s' }}>📸</div>
      <div className="floating-shape absolute bottom-[50%] left-[58%] text-4xl float-1" style={{ animationDelay: '1.2s' }}>💜</div>
      <div className="floating-shape absolute top-[75%] left-[75%] text-3xl float-2" style={{ animationDelay: '4.8s' }}>🎯</div>
      <div className="floating-shape absolute top-[5%] left-[35%] text-2xl float-3" style={{ animationDelay: '2.2s' }}>🐰</div>
      <div className="floating-shape absolute bottom-[20%] right-[5%] text-4xl float-1" style={{ animationDelay: '3.7s' }}>🐈‍⬛</div>
      <div className="floating-shape absolute top-[45%] left-[25%] text-3xl float-2" style={{ animationDelay: '1.9s' }}>🌸</div>

      <Header />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Pet Community</h1>
          <p className="text-muted-foreground">Connect with fellow pet lovers in your area</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full"></div>
                  <input 
                    type="text" 
                    placeholder="Share something with the community..."
                    className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2"
                  />
                  <Button className="btn-gradient">Post</Button>
                </div>
              </CardContent>
            </Card>

            {posts.map((post) => (
              <Card key={post.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full bg-secondary" />
                    <div>
                      <h4 className="font-semibold text-foreground">{post.author}</h4>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded-lg mb-3" />
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg fredoka mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="border-b border-border pb-3 last:border-b-0">
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        {event.attendees} attending
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg fredoka mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Pet Training', 'Health Tips', 'Local Meetups', 'Breed Info'].map((topic) => (
                    <span key={topic} className="bg-secondary text-foreground px-3 py-1 rounded-full text-xs">
                      {topic}
                    </span>
                  ))}
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
