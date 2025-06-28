
import { useState } from 'react';
import Header from '@/components/Header';
import { Users, Star, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookSitting from '@/components/BookSitting';

const PetSitting = () => {
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedSitter, setSelectedSitter] = useState<{ id: string; name: string } | null>(null);
  
  const sitters = [
    {
      id: '1',
      name: 'Alice Johnson',
      experience: '5 years',
      location: 'San Francisco, CA',
      rating: 4.9,
      price: '$25/day',
      image: '/placeholder.svg',
      available: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      experience: '3 years',
      location: 'Los Angeles, CA',
      rating: 4.8,
      price: '$20/day',
      image: '/placeholder.svg',
      available: false
    }
  ];
  return (
    <div className="min-h-screen bg-[#FBE7E7] relative overflow-hidden">
      {/* Floating Background Shapes - Enhanced with more emojis */}
      <div className="floating-shape absolute top-[6%] left-[9%] text-4xl float-1">🏠</div>
      <div className="floating-shape absolute top-[12%] right-[12%] text-3xl float-2">🐾</div>
      <div className="floating-shape absolute bottom-[22%] left-[8%] text-5xl float-3">❤️</div>
      <div className="floating-shape absolute top-[35%] left-[20%] text-2xl float-1" style={{ animationDelay: '2s' }}>🐱</div>
      <div className="floating-shape absolute bottom-[28%] right-[22%] text-3xl float-2" style={{ animationDelay: '3s' }}>💕</div>
      <div className="floating-shape absolute top-[48%] right-[9%] text-4xl float-3" style={{ animationDelay: '1s' }}>🐈</div>
      <div className="floating-shape absolute bottom-[9%] left-[42%] text-2xl float-1" style={{ animationDelay: '4s' }}>🐶</div>
      
      {/* Additional floating emojis for pet sitting */}
      <div className="floating-shape absolute top-[18%] left-[65%] text-3xl float-2" style={{ animationDelay: '1.5s' }}>🐕‍🦺</div>
      <div className="floating-shape absolute top-[62%] left-[18%] text-2xl float-3" style={{ animationDelay: '2.5s' }}>🦴</div>
      <div className="floating-shape absolute bottom-[38%] left-[75%] text-4xl float-1" style={{ animationDelay: '3.5s' }}>🎾</div>
      <div className="floating-shape absolute top-[78%] right-[45%] text-3xl float-2" style={{ animationDelay: '0.5s' }}>🧸</div>
      <div className="floating-shape absolute top-[25%] left-[55%] text-2xl float-3" style={{ animationDelay: '4.5s' }}>🍖</div>
      <div className="floating-shape absolute bottom-[65%] right-[18%] text-5xl float-1" style={{ animationDelay: '1.8s' }}>💙</div>
      <div className="floating-shape absolute top-[88%] left-[25%] text-3xl float-2" style={{ animationDelay: '3.2s' }}>🎈</div>
      <div className="floating-shape absolute bottom-[12%] right-[65%] text-2xl float-3" style={{ animationDelay: '2.8s' }}>⭐</div>
      <div className="floating-shape absolute top-[28%] left-[48%] text-4xl float-1" style={{ animationDelay: '4.2s' }}>🏆</div>
      <div className="floating-shape absolute bottom-[45%] left-[32%] text-3xl float-2" style={{ animationDelay: '0.8s' }}>🌟</div>
      <div className="floating-shape absolute top-[58%] right-[32%] text-2xl float-3" style={{ animationDelay: '3.8s' }}>🐦</div>
      <div className="floating-shape absolute bottom-[52%] left-[62%] text-4xl float-1" style={{ animationDelay: '1.2s' }}>💜</div>
      <div className="floating-shape absolute top-[72%] left-[82%] text-3xl float-2" style={{ animationDelay: '4.8s' }}>🦊</div>
      <div className="floating-shape absolute top-[5%] left-[38%] text-2xl float-3" style={{ animationDelay: '2.2s' }}>🐰</div>
      <div className="floating-shape absolute bottom-[18%] right-[8%] text-4xl float-1" style={{ animationDelay: '3.7s' }}>🐈‍⬛</div>
      <div className="floating-shape absolute top-[42%] left-[12%] text-3xl float-2" style={{ animationDelay: '1.9s' }}>🌸</div>
      
      <Header />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold fredoka text-foreground mb-4">Pet Sitting Services</h1>
          <p className="text-muted-foreground">Find trusted sitters for your beloved pets</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Check Availability
          </Button>
          <Button className="btn-gradient">
            <Users className="w-4 h-4 mr-2" />
            Become a Sitter
          </Button>
        </div>        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitters.map((sitter) => (
            <Card key={sitter.id} className="romantic-card overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <div className="h-48 bg-[#F3EEF8]">
                <img src={sitter.image} alt={sitter.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg fredoka">{sitter.name}</h3>
                <p className="text-sm text-muted-foreground">{sitter.experience} experience</p>
                <div className="flex items-center mt-2 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {sitter.location}
                </div>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-[#C21E56] mr-1" />
                  <span className="text-sm">{sitter.rating}</span>
                  <span className="ml-auto font-semibold text-accent">{sitter.price}</span>
                </div>
                <div className="flex justify-between items-center mt-4">                  <span className={`text-xs px-2 py-1 rounded ${sitter.available ? 'bg-[#F4C2C2] text-burgundy' : 'bg-[#FFD1DC] text-[#C21E56]'}`}>
                    {sitter.available ? 'Available' : 'Busy'}
                  </span>
                  <Button 
                    size="sm" 
                    className="btn-gradient" 
                    disabled={!sitter.available}
                    onClick={() => {
                      setSelectedSitter({
                        id: sitter.id,
                        name: sitter.name
                      });
                      setShowBookForm(true);
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Booking Dialog */}
      <BookSitting
        open={showBookForm}
        onClose={() => {
          setShowBookForm(false);
          setSelectedSitter(null);
        }}
        sitterId={selectedSitter?.id}
        sitterName={selectedSitter?.name}
      />
    </div>
  );
};

export default PetSitting;
