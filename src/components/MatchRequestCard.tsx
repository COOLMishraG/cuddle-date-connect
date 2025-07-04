import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  User, 
  MapPin, 
  Clock, 
  Check, 
  X, 
  MessageCircle 
} from 'lucide-react';
import { formatAnimalType, getGenderSymbol, getAnimalEmoji } from '@/utils/petUtils';
import { matchApi } from '@/services/api';

interface MatchRequestCardProps {
  request: any;
  onStatusChange: () => void;
}

const MatchRequestCard = ({ request, onStatusChange }: MatchRequestCardProps) => {
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    try {
      setProcessing(true);
      await matchApi.approveMatchRequest(request.id);
      onStatusChange();
    } catch (error) {
      console.error('Error approving match request:', error);
      alert('Failed to approve match request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setProcessing(true);
      await matchApi.rejectMatchRequest(request.id);
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting match request:', error);
      alert('Failed to reject match request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" alt={request.requester?.displayName || 'User'} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {(request.requester?.displayName || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-gray-800">
                {request.requester?.displayName || request.requester?.username || 'Unknown User'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(request.createdAt)}</span>
              </div>
            </div>
          </div>
          <Badge 
            className={`${
              request.status === 'PENDING' 
                ? 'bg-yellow-100 text-yellow-800' 
                : request.status === 'APPROVED'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {request.status}
          </Badge>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 text-sm mb-3">Wants to breed with your pet:</p>
          
          {/* Pet Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Requester's Pet */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Their Pet</h4>
              <div className="flex items-center gap-3">
                <img
                  src={request.requesterPet?.image || request.requesterPet?.photoUrl || '/placeholder.svg'}
                  alt={request.requesterPet?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getAnimalEmoji(request.requesterPet?.animal)}</span>
                    <h5 className="font-bold text-gray-800">{request.requesterPet?.name}</h5>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">{request.requesterPet?.breed}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span>{getGenderSymbol(request.requesterPet?.gender)} {request.requesterPet?.gender}</span>
                    <span>{request.requesterPet?.age}y old</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Pet */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Your Pet</h4>
              <div className="flex items-center gap-3">
                <img
                  src={request.recipientPet?.image || request.recipientPet?.photoUrl || '/placeholder.svg'}
                  alt={request.recipientPet?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getAnimalEmoji(request.recipientPet?.animal)}</span>
                    <h5 className="font-bold text-gray-800">{request.recipientPet?.name}</h5>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">{request.recipientPet?.breed}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span>{getGenderSymbol(request.recipientPet?.gender)} {request.recipientPet?.gender}</span>
                    <span>{request.recipientPet?.age}y old</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Message:</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{request.message}</p>
          </div>
        )}

        {/* Action Buttons */}
        {request.status === 'PENDING' && (
          <div className="flex gap-3">
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              {processing ? 'Approving...' : 'Approve'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={processing}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <X className="w-4 h-4 mr-2" />
              {processing ? 'Rejecting...' : 'Decline'}
            </Button>
          </div>
        )}

        {request.status === 'APPROVED' && (
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Check className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800">Match Approved!</p>
            <p className="text-xs text-green-600 mt-1">You can now coordinate with the pet owner.</p>
          </div>
        )}

        {request.status === 'REJECTED' && (
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <X className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-800">Match Declined</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchRequestCard;
