
import Header from '@/components/Header';
import { MessageSquare, Users, Calendar, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Community = () => {
  const posts = [
    {
      id: '1',
      author: 'Sarah Johnson',
      content: 'Just adopted this beautiful Golden Retriever! Any tips for first-time owners?',
      likes: 24,
      comments: 8,
      time: '2 hours ago',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      author: 'Mike Chen',
      content: 'Looking for a playdate partner for my energetic Labrador in SF area!',
      likes: 15,
      comments: 5,
      time: '4 hours ago',
      image: '/placeholder.svg'
    }
  ];

  const events = [
    {
      id: '1',
      title: 'Dog Park Meetup',
      date: 'Saturday, March 15',
      location: 'Golden Gate Park',
      attendees: 12
    },
    {
      id: '2',
      title: 'Pet Care Workshop',
      date: 'Sunday, March 16',
      location: 'Community Center',
      attendees: 8
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Pet Community</h1>
          <p className="text-muted-foreground">Connect with fellow pet lovers and share experiences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-warm rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Share something with the community..."
                    className="flex-1 bg-muted rounded-lg px-4 py-2 text-sm"
                  />
                  <Button className="btn-gradient">
                    <Image className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 bg-gradient-warm rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-semibold text-sm">{post.author}</h4>
                        <p className="text-xs text-muted-foreground">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{post.content}</p>
                    {post.image && (
                      <div className="h-48 bg-gray-200 rounded-lg mb-3">
                        <img src={post.image} alt="Post" className="w-full h-full object-cover rounded-lg" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-accent">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-accent">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-bold fredoka mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="border-l-2 border-accent pl-3">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                      <p className="text-xs text-accent">{event.attendees} attending</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 btn-gradient">
                  <Calendar className="w-4 h-4 mr-2" />
                  View All Events
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold fredoka mb-4">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['Training Tips', 'Health Care', 'Nutrition', 'Grooming', 'Playtime'].map((topic) => (
                    <span key={topic} className="bg-muted text-xs px-2 py-1 rounded cursor-pointer hover:bg-accent hover:text-white transition-colors">
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
