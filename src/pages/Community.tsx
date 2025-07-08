
import Header from '../components/Header';
import { Heart, Users, MessageSquare, Calendar, MapPin, Star, Image, Send, Loader } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { postApi, commentApi, userApi } from '@/services/api';
import { uploadImageToCloudinary, validateImageFile } from '@/services/cloudinary';
import { User } from '@/types/user';

interface Post {
  id: string;
  content: string;
  owner: string;
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  postId: string;
}

const Community = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [commentsVisible, setCommentsVisible] = useState<{ [key: string]: boolean }>({});
  const [commentCounts, setCommentCounts] = useState<{ [key: string]: number }>({});
  const [postComments, setPostComments] = useState<{ [key: string]: Comment[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});
  const [commentAuthors, setCommentAuthors] = useState<{ [key: string]: User }>({});
  const [postAuthors, setPostAuthors] = useState<{ [key: string]: User }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postApi.getAllPosts();
      
      // Sort posts by creation date (newest first)
      const sortedPosts = fetchedPosts.sort((a: Post, b: Post) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(sortedPosts);
      
      // Fetch comment counts for each post
      const counts: { [key: string]: number } = {};
      for (const post of sortedPosts) {
        try {
          const comments = await commentApi.getPostComments(post.id);
          counts[post.id] = comments.length;
        } catch (error) {
          console.error(`Error fetching comments for post ${post.id}:`, error);
          counts[post.id] = 0;
        }
      }
      setCommentCounts(counts);
      
      // Fetch user data for post authors
      const uniquePostAuthors = [...new Set(sortedPosts.map((post: Post) => post.owner))];
      await Promise.all(uniquePostAuthors.map((author: string) => fetchUserByUsernameForPosts(author)));
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedImage) return;
    if (!currentUser) {
      alert('Please sign in to create a post');
      return;
    }

    try {
      setPosting(true);
      
      let imageUri: string | undefined;
      if (selectedImage) {
        console.log('Selected image for upload:', selectedImage.name);
        setUploadingImage(true);
        
        try {
          // Upload to Cloudinary using the service
          imageUri = await uploadImageToCloudinary(selectedImage, 'community_posts');
          console.log('Image uploaded successfully to Cloudinary:', imageUri);
        } catch (error) {
          console.error('Failed to upload image:', error);
          alert('Failed to upload image. Please try again.');
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Only send imageUri if we have a valid URL
      const postData: any = {
        content: newPostContent.trim(),
        owner: currentUser.displayName || currentUser.username || currentUser.email,
      };

      // Only add imageUri if we have a valid URL
      if (imageUri) {
        postData.imageUri = imageUri;
      }

      console.log('Creating post with data:', postData);
      await postApi.createPost(postData);
      console.log('Post created successfully!');
      
      // Clear form
      setNewPostContent('');
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh posts
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    const commentContent = newComments[postId];
    if (!commentContent?.trim()) return;
    if (!currentUser) {
      alert('Please sign in to comment');
      return;
    }

    try {
      const commentData = {
        content: commentContent.trim(),
        author: currentUser.displayName || currentUser.username || currentUser.email,
        postId
      };

      const newComment = await commentApi.createComment(commentData);
      
      // Clear comment input
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      
      // Update comment count
      setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      
      // Add new comment to local state
      setPostComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      
      // Fetch user data for the new comment author if we don't have it
      if (newComment.author && !commentAuthors[newComment.author]) {
        await fetchUserByUsername(newComment.author);
      }
      
      // Also fetch post author data if we don't have it (for consistency)
      const currentPost = posts.find(p => p.id === postId);
      if (currentPost && !postAuthors[currentPost.owner]) {
        await fetchUserByUsernameForPosts(currentPost.owner);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const fetchUserByUsername = async (username: string): Promise<User | null> => {
    try {
      // Check if we already have this user's data
      if (commentAuthors[username]) {
        console.log(`User data already cached for ${username}:`, commentAuthors[username]);
        return commentAuthors[username];
      }
      
      console.log(`Fetching user data for username: ${username}`);
      const userData = await userApi.getUserByUsername(username);
      console.log(`User data fetched for ${username}:`, userData);
      
      // Store the user data in our cache
      setCommentAuthors(prev => ({ ...prev, [username]: userData }));
      
      return userData;
    } catch (error) {
      console.error(`Error fetching user data for ${username}:`, error);
      return null;
    }
  };

  const fetchUserByUsernameForPosts = async (username: string): Promise<User | null> => {
    try {
      // Check if we already have this user's data
      if (postAuthors[username]) {
        console.log(`Post author data already cached for ${username}:`, postAuthors[username]);
        return postAuthors[username];
      }
      
      console.log(`Fetching post author data for username: ${username}`);
      const userData = await userApi.getUserByUsername(username);
      console.log(`Post author data fetched for ${username}:`, userData);
      
      // Store the user data in our cache
      setPostAuthors(prev => ({ ...prev, [username]: userData }));
      
      return userData;
    } catch (error) {
      console.error(`Error fetching post author data for ${username}:`, error);
      return null;
    }
  };

  const toggleComments = async (postId: string) => {
    const isCurrentlyVisible = commentsVisible[postId];
    setCommentsVisible(prev => ({ ...prev, [postId]: !prev[postId] }));
    
    // If we're opening comments and haven't fetched them yet, fetch them
    if (!isCurrentlyVisible && !postComments[postId]) {
      try {
        setLoadingComments(prev => ({ ...prev, [postId]: true }));
        const comments = await commentApi.getPostComments(postId);
        setPostComments(prev => ({ ...prev, [postId]: comments }));
        
        // Fetch user data for each comment author
        const uniqueAuthors = [...new Set(comments.map((comment: Comment) => comment.author))];
        await Promise.all(uniqueAuthors.map((author: string) => fetchUserByUsername(author)));
        
      } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const renderUserAvatar = (username: string, size: 'sm' | 'md' | 'lg' = 'sm', userType: 'comment' | 'post' = 'comment') => {
    const user = userType === 'comment' ? commentAuthors[username] : postAuthors[username];
    const avatarSize = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12';
    const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg';
    
    if (user?.profileImage) {
      return (
        <div className="relative">
          <img 
            src={user.profileImage} 
            alt={`${username}'s profile`}
            className={`${avatarSize} rounded-full object-cover border-2 border-white/50`}
            onError={(e) => {
              // Hide the image and show fallback
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) {
                fallback.style.display = 'flex';
              }
            }}
          />
          {/* Fallback avatar (hidden by default) */}
          <div 
            className={`${avatarSize} bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center`}
            style={{ display: 'none' }}
          >
            <span className={`text-white font-bold ${textSize}`}>
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      );
    }
    
    // Default fallback to initials
    return (
      <div className={`${avatarSize} bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center`}>
        <span className={`text-white font-bold ${textSize}`}>
          {username.charAt(0).toUpperCase()}
        </span>
      </div>
    );
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
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Share something with the community..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="flex-1 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white/50 border-white/30 hover:bg-white/60"
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleCreatePost}
                      disabled={posting || uploadingImage || (!newPostContent.trim() && !selectedImage)}
                      className="premium-gradient text-white px-6 py-3 h-auto disabled:opacity-50"
                    >
                      {posting ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          {uploadingImage ? 'Uploading Image...' : 'Posting...'}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post ✨
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card className="glass-card border-0 bg-white/40 backdrop-blur-lg">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
                  <p className="text-gray-500">Be the first to share something with the community!</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="glass-card border-0 bg-white/40 backdrop-blur-lg hover:bg-white/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      {renderUserAvatar(post.owner, 'lg', 'post')}
                      <div>
                        <h4 className="font-bold text-gray-800">{post.owner}</h4>
                        <p className="text-sm text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    
                    {post.imageUri && (
                      <div className="mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={post.imageUri} 
                          alt="Post image" 
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm border-t border-white/30 pt-4">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group">
                        <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Like</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors group"
                      >
                        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{commentCounts[post.id] || 0} Comments</span>
                      </button>
                    </div>
                    
                    {/* Comments Section */}
                    {commentsVisible[post.id] && (
                      <div className="mt-4 border-t border-white/30 pt-4">
                        {/* Loading Comments */}
                        {loadingComments[post.id] && (
                          <div className="flex items-center justify-center py-4">
                            <Loader className="w-4 h-4 animate-spin text-blue-500 mr-2" />
                            <span className="text-gray-500 text-sm">Loading comments...</span>
                          </div>
                        )}
                        
                        {/* Existing Comments */}
                        {!loadingComments[post.id] && postComments[post.id] && postComments[post.id].length > 0 && (
                          <div className="space-y-3 mb-4">
                            {postComments[post.id].map((comment) => (
                              <div key={comment.id} className="bg-white/30 rounded-lg p-3 border border-white/20">
                                <div className="flex items-center space-x-2 mb-2">
                                  {renderUserAvatar(comment.author, 'sm', 'comment')}
                                  <span className="font-medium text-gray-700 text-sm">{comment.author}</span>
                                  <span className="text-gray-500 text-xs">
                                    {formatTimeAgo(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed pl-8">{comment.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* No Comments Message */}
                        {!loadingComments[post.id] && postComments[post.id] && postComments[post.id].length === 0 && (
                          <div className="text-center py-4 mb-4">
                            <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                          </div>
                        )}
                        
                        {/* Add New Comment */}
                        <div className="flex items-center space-x-3">
                          {currentUser && (
                            <div className="flex-shrink-0">
                              {currentUser.profileImage ? (
                                <img 
                                  src={currentUser.profileImage} 
                                  alt="Your profile"
                                  className="w-8 h-8 rounded-full object-cover border-2 border-white/50"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">
                                    {(currentUser.displayName || currentUser.username || currentUser.email).charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComments[post.id] || ''}
                            onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                            className="flex-1 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddComment(post.id);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newComments[post.id]?.trim()}
                            className="bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
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
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-bold text-blue-600">{posts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Comments</span>
                    <span className="font-bold text-green-600">
                      {Object.values(commentCounts).reduce((total, count) => total + count, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posts Today</span>
                    <span className="font-bold text-purple-600">
                      {posts.filter(post => {
                        const today = new Date();
                        const postDate = new Date(post.createdAt);
                        return postDate.toDateString() === today.toDateString();
                      }).length}
                    </span>
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
