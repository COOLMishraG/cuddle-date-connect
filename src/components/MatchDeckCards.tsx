import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, X, ChevronDown, Star, MapPin, Calendar, Users } from 'lucide-react';
import { matchApi } from '@/services/api';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  imageUrl?: string; // Cloudinary image URL (main property)
  image_url?: string;
  image?: string;
  photoUrl?: string;
  gender: string;
  description?: string;
  animal?: string;
}

interface User {
  id: string;
  name: string;
  displayName?: string;
  username?: string;
  email: string;
}

interface MatchRequest {
  id: string;
  requester: User;
  recipient: User;
  requesterPet: Pet;
  recipientPet: Pet;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  // Legacy support for existing implementations
  requester_id?: string;
  requester_pet_id?: string;
  target_id?: string;
  target_pet_id?: string;
  created_at?: string;
  requester_pet?: Pet;
  target_pet?: Pet;
}

interface MatchDeckCardsProps {
  matchRequests: MatchRequest[];
  onStatusChange: () => void;
}

const MatchDeckCards: React.FC<MatchDeckCardsProps> = ({ matchRequests, onStatusChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter to only show pending match requests - skip approved and rejected ones
  const pendingMatchRequests = matchRequests.filter(request => request.status === 'PENDING');

  // Reset current index when pending requests change
  useEffect(() => {
    if (currentIndex >= pendingMatchRequests.length && pendingMatchRequests.length > 0) {
      setCurrentIndex(0);
    }
  }, [pendingMatchRequests.length, currentIndex]);

  const handleApprove = async () => {
    if (currentIndex >= pendingMatchRequests.length) return;
    
    const request = pendingMatchRequests[currentIndex];
    try {
      await matchApi.approveMatchRequest(request.id);
      // Immediately refresh to get updated data
      onStatusChange();
      // If there are more requests, adjust index if needed
      if (currentIndex >= pendingMatchRequests.length - 1 && pendingMatchRequests.length > 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } catch (error) {
      console.error('Error approving match request:', error);
      alert('Failed to approve match request. Please try again.');
    }
  };

  const handleDecline = async () => {
    if (currentIndex >= pendingMatchRequests.length) return;
    
    const request = pendingMatchRequests[currentIndex];
    try {
      await matchApi.rejectMatchRequest(request.id);
      // Immediately refresh to get updated data
      onStatusChange();
      // If there are more requests, adjust index if needed
      if (currentIndex >= pendingMatchRequests.length - 1 && pendingMatchRequests.length > 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    } catch (error) {
      console.error('Error rejecting match request:', error);
      alert('Failed to reject match request. Please try again.');
    }
  };

  const moveToNext = () => {
    if (currentIndex < pendingMatchRequests.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset index and trigger refresh when we reach the end
      setCurrentIndex(0);
      onStatusChange();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < pendingMatchRequests.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (pendingMatchRequests.length === 0) {
    return null;
  }

  const currentRequest = pendingMatchRequests[currentIndex];
  if (!currentRequest) return null;

  const remainingCards = pendingMatchRequests.length - currentIndex;
  
  // Get pet data with fallbacks for different property names
  const userPet = currentRequest.recipientPet || currentRequest.target_pet;
  const matchedPet = currentRequest.requesterPet || currentRequest.requester_pet;
  const requesterName = currentRequest.requester?.displayName || currentRequest.requester?.name || currentRequest.requester?.username || 'Unknown User';

  const getPetImage = (pet: Pet | undefined) => {
    return pet?.imageUrl || pet?.image_url || pet?.image || pet?.photoUrl || '/placeholder.svg';
  };

  return (
    <>
      {/* Notification Banner */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 pointer-events-auto animate-pulse">
          <div className="flex items-center gap-2 justify-center">
            <Heart className="w-5 h-5 animate-bounce" />
            <span className="font-bold text-lg">
              {pendingMatchRequests.length} New Match Request{pendingMatchRequests.length !== 1 ? 's' : ''}!
            </span>
          </div>
          <div className="text-center text-sm opacity-90 mt-1 font-medium">
            Check the floating cards below
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-between items-end px-8 pointer-events-none z-30">
      {/* Left Card - Your Pet (with Decline action) */}
      <div 
        className="relative pointer-events-auto"
        onWheel={handleWheel}
      >
        {/* Stack effect - show multiple cards behind */}
        {remainingCards > 1 && (
          <>
            <div className="absolute inset-0 bg-white rounded-2xl transform translate-x-2 translate-y-2 scale-95 opacity-20 shadow-lg" />
            {remainingCards > 2 && (
              <div className="absolute inset-0 bg-white rounded-2xl transform translate-x-4 translate-y-4 scale-90 opacity-10 shadow-lg" />
            )}
          </>
        )}
        
        <Card className="w-80 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="relative">
            <img 
              src={getPetImage(userPet)} 
              alt={userPet?.name || 'Your Pet'}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-blue-500 text-white">
                <Users className="w-3 h-3 mr-1" />
                Your Pet
              </Badge>
              <Badge variant="outline" className="bg-white/90 text-slate-700">
                {userPet?.animal || 'Pet'}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{userPet?.name || 'Unknown'}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-1">
                  <Star className="w-3 h-3 mr-1" />
                  {userPet?.breed || 'Mixed Breed'}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {userPet?.age || 'Unknown'} years old
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-slate-700">{userPet?.gender || 'Unknown'}</span>
                <span className="text-sm text-slate-500 ml-2">• Ready to match</span>
              </div>
            </div>
            
            {userPet?.description && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{userPet.description}</p>
            )}
            
            <div className="flex flex-wrap gap-1 mb-4">
              {userPet?.breed && (
                <Badge variant="outline" className="text-xs">
                  {userPet.breed}
                </Badge>
              )}
              {userPet?.gender && (
                <Badge variant="outline" className="text-xs">
                  {userPet.gender}
                </Badge>
              )}
              {userPet?.animal && (
                <Badge variant="outline" className="text-xs">
                  {userPet.animal}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Your location
              </div>
              <div>Match request received</div>
            </div>
            
            <Button
              onClick={handleDecline}
              className="w-full bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Decline Match
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scroll indicator */}
      {pendingMatchRequests.length > 1 && (
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 pointer-events-auto">
          <div className="flex flex-col items-center text-slate-700 animate-bounce">
            <ChevronDown className="w-4 h-4 mb-1 drop-shadow-sm" />
            <span className="text-xs drop-shadow-sm font-medium">Scroll to navigate</span>
            <div className="text-xs mt-1 bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-800 font-medium shadow-sm">
              {currentIndex + 1} / {pendingMatchRequests.length}
            </div>
          </div>
        </div>
      )}

      {/* Right Card - Matched Pet (with Approve action) */}
      <div 
        className="relative pointer-events-auto"
        onWheel={handleWheel}
      >
        {/* Stack effect - show multiple cards behind */}
        {remainingCards > 1 && (
          <>
            <div className="absolute inset-0 bg-white rounded-2xl transform -translate-x-2 translate-y-2 scale-95 opacity-20 shadow-lg" />
            {remainingCards > 2 && (
              <div className="absolute inset-0 bg-white rounded-2xl transform -translate-x-4 translate-y-4 scale-90 opacity-10 shadow-lg" />
            )}
          </>
        )}
        
        <Card className="w-80 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
          <div className="relative">
            <img 
              src={getPetImage(matchedPet)} 
              alt={matchedPet?.name || 'Matched Pet'}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-emerald-500 text-white">
                <Heart className="w-3 h-3 mr-1" />
                Match Request
              </Badge>
              <Badge variant="outline" className="bg-white/90 text-slate-700">
                {matchedPet?.animal || 'Pet'}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 font-bold text-slate-800 shadow-lg text-sm">
              New Match!
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{matchedPet?.name || 'Unknown'}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-1">
                  <Star className="w-3 h-3 mr-1" />
                  {matchedPet?.breed || 'Mixed Breed'}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {matchedPet?.age || 'Unknown'} years old
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-slate-700">{matchedPet?.gender || 'Unknown'}</span>
                <span className="text-sm text-slate-500 ml-2">• by {requesterName}</span>
              </div>
            </div>
            
            {matchedPet?.description && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{matchedPet.description}</p>
            )}
            
            <div className="flex flex-wrap gap-1 mb-4">
              {matchedPet?.breed && (
                <Badge variant="outline" className="text-xs">
                  {matchedPet.breed}
                </Badge>
              )}
              {matchedPet?.gender && (
                <Badge variant="outline" className="text-xs">
                  {matchedPet.gender}
                </Badge>
              )}
              {matchedPet?.animal && (
                <Badge variant="outline" className="text-xs">
                  {matchedPet.animal}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Owner: {requesterName}
              </div>
              <div>Looking for companionship</div>
            </div>
            
            <Button
              onClick={handleApprove}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300"
            >
              <Heart className="w-4 h-4 mr-2" />
              Approve Match
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default MatchDeckCards;
