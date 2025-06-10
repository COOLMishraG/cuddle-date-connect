import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, Clock, DollarSign, AlertCircle, X, Bone } from 'lucide-react';

// Mock data for service history
const mockMatches = [
  {
    id: 'match-1',
    type: 'breeding',
    status: 'APPROVED',
    date: '2025-05-15',
    partnerName: 'Luna',
    partnerOwner: 'Sarah Wilson',
    partnerImage: '/placeholder.svg',
    petName: 'Max',
    petImage: '/placeholder.svg'
  },
  {
    id: 'match-2',
    type: 'breeding',
    status: 'PENDING',
    date: '2025-06-01',
    partnerName: 'Bella',
    partnerOwner: 'John Smith',
    partnerImage: '/placeholder.svg',
    petName: 'Rex',
    petImage: '/placeholder.svg'
  },
  {
    id: 'match-3',
    type: 'breeding',
    status: 'REJECTED',
    date: '2025-04-10',
    partnerName: 'Charlie',
    partnerOwner: 'Emily Jones',
    partnerImage: '/placeholder.svg',
    petName: 'Max',
    petImage: '/placeholder.svg'
  }
];

const mockSittings = [
  {
    id: 'sitting-1',
    type: 'sitting',
    status: 'COMPLETED',
    date: '2025-05-10',
    endDate: '2025-05-15',
    sitterName: 'Alice Johnson',
    sitterImage: '/placeholder.svg',
    petName: 'Max',
    petImage: '/placeholder.svg',
    cost: 125
  },
  {
    id: 'sitting-2',
    type: 'sitting',
    status: 'UPCOMING',
    date: '2025-06-20',
    endDate: '2025-06-25',
    sitterName: 'Mike Chen',
    sitterImage: '/placeholder.svg',
    petName: 'Rex',
    petImage: '/placeholder.svg',
    cost: 150
  }
];

const mockVetVisits = [
  {
    id: 'vet-1',
    type: 'veterinary',
    status: 'COMPLETED',
    date: '2025-05-05',
    vetName: 'Dr. Sarah Williams',
    vetImage: '/placeholder.svg',
    petName: 'Max',
    petImage: '/placeholder.svg',
    reason: 'Annual checkup',
    cost: 80
  },
  {
    id: 'vet-2',
    type: 'veterinary',
    status: 'UPCOMING',
    date: '2025-06-15',
    vetName: 'Dr. Michael Brown',
    vetImage: '/placeholder.svg',
    petName: 'Rex',
    petImage: '/placeholder.svg',
    reason: 'Vaccination',
    cost: 60
  },
  {
    id: 'vet-3',
    type: 'veterinary',
    status: 'EMERGENCY',
    date: '2025-05-25',
    vetName: 'Dr. Sarah Williams',
    vetImage: '/placeholder.svg',
    petName: 'Bella',
    petImage: '/placeholder.svg',
    reason: 'Injury treatment',
    cost: 150
  }
];

// Service history component
const ServiceHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Define service type for TypeScript
  type ServiceItem = {
    id: string;
    type: string;
    status: string;
    date: string;
    service: string;
    petName: string;
    petImage: string;
    partnerName?: string;
    partnerOwner?: string;
    partnerImage?: string;
    sitterName?: string;
    sitterImage?: string;
    endDate?: string;
    vetName?: string;
    vetImage?: string;
    reason?: string;
    cost?: number;
  }
  
  // Combine all services for the "All" tab
  const allServices: ServiceItem[] = [
    ...mockMatches.map(match => ({ ...match, service: 'Breeding' })),
    ...mockSittings.map(sitting => ({ ...sitting, service: 'Pet Sitting' })),
    ...mockVetVisits.map(visit => ({ ...visit, service: 'Veterinary' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    let color = '';
    let icon = null;
    
    switch(status) {
      case 'APPROVED':
      case 'COMPLETED':
        color = 'bg-green-100 text-green-800 border-green-200';
        icon = <Check className="w-3 h-3" />;
        break;
      case 'PENDING':
      case 'UPCOMING':
        color = 'bg-blue-100 text-blue-800 border-blue-200';
        icon = <Clock className="w-3 h-3" />;
        break;
      case 'REJECTED':
        color = 'bg-red-100 text-red-800 border-red-200';
        icon = <X className="w-3 h-3" />;
        break;      case 'EMERGENCY':
        color = 'bg-amber-100 text-amber-800 border-amber-200';
        icon = <AlertCircle className="w-3 h-3" />;
        break;
      default:
        color = 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    return (
      <Badge variant="outline" className={`flex items-center gap-1 ${color}`}>
        {icon} {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-burgundy mb-4">Service History</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
            All
          </TabsTrigger>
          <TabsTrigger value="breeding" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
            Breeding
          </TabsTrigger>
          <TabsTrigger value="sitting" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
            Pet Sitting
          </TabsTrigger>
          <TabsTrigger value="vet" className="data-[state=active]:bg-burgundy data-[state=active]:text-white">
            Veterinary
          </TabsTrigger>
        </TabsList>
        
        {/* All Services */}
        <TabsContent value="all" className="space-y-3">
          {allServices.length > 0 ? (
            allServices.map((service) => (
              <Card key={service.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <img 
                        src={service.type === 'breeding' ? service.partnerImage : 
                             (service.type === 'sitting' ? service.sitterImage : service.vetImage)} 
                        alt="Service provider" 
                      />
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200">
                          {service.service}
                        </Badge>
                        {renderStatusBadge(service.status)}
                      </div>
                      
                      <p className="font-medium mt-1">
                        {service.type === 'breeding' ? 
                          `Match with ${service.partnerName} (${service.partnerOwner})` :
                          service.type === 'sitting' ?
                          `Care by ${service.sitterName}` :
                          `Visit with ${service.vetName}`
                        }
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(service.date)}
                          {service.type === 'sitting' && service.endDate && 
                            ` - ${formatDate(service.endDate)}`
                          }
                        </span>
                        
                        {(service.type === 'sitting' || service.type === 'veterinary') && service.cost && (
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            ${service.cost}
                          </span>
                        )}
                        
                        <span className="flex items-center">                          <Bone className="w-3 h-3 mr-1" />
                          {service.petName}
                        </span>
                      </div>                      {service.type === 'veterinary' && service.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {service.reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No service history available</p>
          )}
        </TabsContent>
        
        {/* Breeding Tab */}
        <TabsContent value="breeding" className="space-y-3">
          {mockMatches.length > 0 ? (
            mockMatches.map((match) => (
              <Card key={match.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <img src={match.partnerImage} alt={match.partnerName} />
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200">
                          Breeding Match
                        </Badge>
                        {renderStatusBadge(match.status)}
                      </div>
                      
                      <p className="font-medium mt-1">
                        Match with {match.partnerName} ({match.partnerOwner})
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(match.date)}
                        </span>
                        <span className="flex items-center">                          <Bone className="w-3 h-3 mr-1" />
                          {match.petName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No breeding matches history available</p>
          )}
        </TabsContent>
        
        {/* Pet Sitting Tab */}
        <TabsContent value="sitting" className="space-y-3">
          {mockSittings.length > 0 ? (
            mockSittings.map((sitting) => (
              <Card key={sitting.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <img src={sitting.sitterImage} alt={sitting.sitterName} />
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200">
                          Pet Sitting
                        </Badge>
                        {renderStatusBadge(sitting.status)}
                      </div>
                      
                      <p className="font-medium mt-1">
                        Care by {sitting.sitterName}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(sitting.date)} - {formatDate(sitting.endDate)}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${sitting.cost}
                        </span>                        <span className="flex items-center">
                          <Bone className="w-3 h-3 mr-1" />
                          {sitting.petName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No pet sitting history available</p>
          )}
        </TabsContent>
        
        {/* Veterinary Tab */}
        <TabsContent value="vet" className="space-y-3">
          {mockVetVisits.length > 0 ? (
            mockVetVisits.map((visit) => (
              <Card key={visit.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 border border-gray-200">
                      <img src={visit.vetImage} alt={visit.vetName} />
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200">
                          Veterinary Visit
                        </Badge>
                        {renderStatusBadge(visit.status)}
                      </div>
                      
                      <p className="font-medium mt-1">
                        Visit with {visit.vetName}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(visit.date)}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${visit.cost}
                        </span>                        <span className="flex items-center">
                          <Bone className="w-3 h-3 mr-1" />
                          {visit.petName}
                        </span>                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Reason: {visit.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No veterinary visit history available</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceHistory;
