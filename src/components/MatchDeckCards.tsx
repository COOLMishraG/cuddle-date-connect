import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, ChevronDown } from 'lucide-react';
import { matchApi } from '@/services/api';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
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
  requester_id?: string;
  requester_pet_id?: string;
  target_id?: string;
  target_pet_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  createdAt?: string;
  requester_pet?: Pet;
  requesterPet?: Pet;
  target_pet?: Pet;
  recipientPet?: Pet;
  requester?: User;
  message?: string;
}

interface MatchDeckCardsProps {
  matchRequests: MatchRequest[];
  onStatusChange: () => void;
}

const MatchDeckCards: React.FC<MatchDeckCardsProps> = ({ matchRequests, onStatusChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleApprove = async () => {
    if (currentIndex >= matchRequests.length) return;
    
    const request = matchRequests[currentIndex];
    try {
      await matchApi.approveMatchRequest(request.id);
      moveToNext();
      onStatusChange();
    } catch (error) {
      console.error('Error approving match request:', error);
    }
  };

  const handleDecline = async () => {
    if (currentIndex >= matchRequests.length) return;
    
    const request = matchRequests[currentIndex];
    try {
      await matchApi.rejectMatchRequest(request.id);
      moveToNext();
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting match request:', error);
    }
  };

  const moveToNext = () => {
    if (currentIndex < matchRequests.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onStatusChange();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < matchRequests.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (matchRequests.length === 0) {
    return null;
  }

  const currentRequest = matchRequests[currentIndex];
  if (!currentRequest) return null;

  const remainingCards = matchRequests.length - currentIndex;
  
  // Get pet data with fallbacks for different property names
  const userPet = currentRequest.target_pet || currentRequest.recipientPet;
  const matchedPet = currentRequest.requester_pet || currentRequest.requesterPet;
  const requesterName = currentRequest.requester?.displayName || currentRequest.requester?.name || currentRequest.requester?.username || 'Unknown User';

  const getPetImage = (pet: Pet | undefined) => {
    return pet?.image_url || pet?.image || pet?.photoUrl || '/placeholder.svg';
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-between items-end px-8 pointer-events-none z-30">
      {/* Left Card - Your Pet (with Decline action) */}
      <div 
        className="relative pointer-events-auto"
        onWheel={handleWheel}
      >
        {/* Stack effect - show multiple cards behind */}
        {remainingCards > 1 && (
          <>
            <div className="absolute inset-0 bg-white/15 backdrop-blur-md rounded-3xl transform translate-x-2 translate-y-2 scale-95 border border-white/20" />
            {remainingCards > 2 && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl transform translate-x-4 translate-y-4 scale-90 border border-white/15" />
            )}
          </>
        )}
        
        <Card className="w-80 h-[420px] bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />
          
          <div className="relative h-full p-6 flex flex-col justify-between">
            <div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 drop-shadow-sm">Your Pet</h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-gray-600/60 to-transparent mx-auto" />
              </div>
              
              <div className="flex-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-3 border-white/25 shadow-lg">
                  <img 
                    src={getPetImage(userPet)} 
                    alt={userPet?.name || 'Your Pet'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">{userPet?.name || 'Unknown'}</h4>
                <p className="text-gray-700 text-sm mb-1 font-medium drop-shadow-sm">{userPet?.breed || 'Mixed Breed'}</p>
                <p className="text-gray-600 text-sm mb-4 drop-shadow-sm">{userPet?.age || 'Unknown'} years old • {userPet?.gender || 'Unknown'}</p>
                
                {userPet?.description && (
                  <p className="text-gray-700 text-xs text-center leading-relaxed line-clamp-3 drop-shadow-sm">
                    {userPet.description}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={handleDecline}
              variant="ghost"
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-gray-900 border border-red-400/30 hover:border-red-400/50 backdrop-blur-sm transition-all duration-300 rounded-2xl py-3 font-medium drop-shadow-sm mt-4"
            >
              <X className="w-5 h-5 mr-2" />
              Decline
            </Button>
          </div>
        </Card>
      </div>

      {/* Scroll indicator */}
      {matchRequests.length > 1 && (
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 pointer-events-auto">
          <div className="flex flex-col items-center text-gray-700 animate-bounce">
            <ChevronDown className="w-4 h-4 mb-1 drop-shadow-sm" />
            <span className="text-xs drop-shadow-sm font-medium">Scroll to navigate</span>
            <div className="text-xs mt-1 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-400/30 text-gray-800 font-medium drop-shadow-sm">
              {currentIndex + 1} / {matchRequests.length}
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
            <div className="absolute inset-0 bg-white/15 backdrop-blur-md rounded-3xl transform -translate-x-2 translate-y-2 scale-95 border border-white/20" />
            {remainingCards > 2 && (
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl transform -translate-x-4 translate-y-4 scale-90 border border-white/15" />
            )}
          </>
        )}
        
        <Card className="w-80 h-[420px] bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5" />
          
          <div className="relative h-full p-6 flex flex-col justify-between">
            <div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 drop-shadow-sm">Match Request</h3>
                <div className="w-16 h-0.5 bg-gradient-to-r from-gray-600/60 to-transparent mx-auto" />
              </div>
              
              <div className="flex-1 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-3 border-white/25 shadow-lg">
                  <img 
                    src={getPetImage(matchedPet)} 
                    alt={matchedPet?.name || 'Matched Pet'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">{matchedPet?.name || 'Unknown'}</h4>
                <p className="text-gray-700 text-sm mb-1 font-medium drop-shadow-sm">{matchedPet?.breed || 'Mixed Breed'}</p>
                <p className="text-gray-600 text-sm mb-2 drop-shadow-sm">{matchedPet?.age || 'Unknown'} years old • {matchedPet?.gender || 'Unknown'}</p>
                <p className="text-gray-500 text-xs mb-4 font-medium drop-shadow-sm">from {requesterName}</p>
                
                {matchedPet?.description && (
                  <p className="text-gray-700 text-xs text-center leading-relaxed line-clamp-3 drop-shadow-sm">
                    {matchedPet.description}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              onClick={handleApprove}
              variant="ghost"
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-gray-900 border border-green-400/30 hover:border-green-400/50 backdrop-blur-sm transition-all duration-300 rounded-2xl py-3 font-medium drop-shadow-sm mt-4"
            >
              <Heart className="w-5 h-5 mr-2" />
              Approve
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MatchDeckCards;
