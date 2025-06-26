import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X, ChevronLeft, ChevronRight, MessageSquare, RefreshCcw, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

// Default testimonial data - serves as fallback when API is unavailable
const defaultTestimonials = [
	{
		id: 1,
		name: 'Sarah Miller',
		role: 'Pet Owner',
		content:
			'Found the perfect match for my Golden Retriever in just a week! The matching algorithm is amazing and the health verification gave me peace of mind.',
		rating: 5,
		avatar: '/placeholder.svg',
		date: 'May 28, 2025',
	},
	{
		id: 2,
		name: 'Michael Johnson',
		role: 'Dog Breeder',
		content:
			'As a professional breeder, I appreciate the health verification system. Makes breeding safer for everyone and the platform is very intuitive.',
		rating: 5,
		avatar: '/placeholder.svg',
		date: 'Jun 2, 2025',
	},
	{
		id: 3,
		name: 'Amy Williams',
		role: 'Pet Owner',
		content:
			'The pet sitting service was a lifesaver during my vacation. Found a wonderful sitter who sent daily updates with photos of my cats!',
		rating: 4,
		avatar: '/placeholder.svg',
		date: 'May 15, 2025',
	},
	{
		id: 4,
		name: 'David Chen',
		role: 'Veterinarian',
		content:
			'The platform makes it so easy to connect with pet owners. My schedule is always full now and I can organize my appointments efficiently.',
		rating: 5,
		avatar: '/placeholder.svg',
		date: 'Jun 5, 2025',
	},
	{
		id: 5,
		name: 'Jessica Taylor',
		role: 'Pet Sitter',
		content:
			'I started pet sitting as a side gig, and now it\'s my full-time job thanks to all the requests I get! The verification system gives pet owners confidence.',
		rating: 5,
		avatar: '/placeholder.svg',
		date: 'Jun 8, 2025',
	},
];

// Define testimonial type
type Testimonial = {
	id: number | string;
	name: string;
	role: string;
	content: string;
	rating: number;
	avatar: string;
	date: string;
};

// API endpoint - would point to your real backend in production
const API_URL = 'https://api.petmatch.example/testimonials';

const Testimonials = () => {	// Initialize state with localStorage values if available
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const [isDismissed, setIsDismissed] = useState(false); // Start with false, we'll use useEffect to load from localStorage
	const [isPaused, setIsPaused] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

	// Fetch testimonials from API
	const fetchTestimonials = async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Simulate API call - replace with actual fetch in production
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// In a real app, uncomment the fetch call below and remove the mock data logic
			// const response = await fetch(API_URL);
			// if (!response.ok) throw new Error('Failed to fetch testimonials');
			// const data = await response.json();
			// setTestimonials(data);

			// For demo purposes, we're using the default testimonials with a delayed response
			// Add any local storage testimonials if they exist
			const localTestimonials = localStorage.getItem('userTestimonials');
			if (localTestimonials) {
				const parsedLocalTestimonials = JSON.parse(localTestimonials);
				setTestimonials([...defaultTestimonials, ...parsedLocalTestimonials]);
			}

			setIsLoading(false);
		} catch (err) {
			console.error('Error fetching testimonials:', err);
			setError('Failed to load testimonials');
			setIsLoading(false);

			// Fallback to default testimonials
			setTestimonials(defaultTestimonials);
		}
	};
	// Load isDismissed from localStorage on component mount
	useEffect(() => {
		const saved = localStorage.getItem('testimonialsDismissed');
		if (saved) {
			try {
				const savedValue = JSON.parse(saved);
				setIsDismissed(savedValue);
			} catch (e) {
				// If there's an error parsing the value, reset it
				localStorage.removeItem('testimonialsDismissed');
			}
		}
	}, []);

	// Fetch testimonials on component mount
	useEffect(() => {
		fetchTestimonials();
	}, []);

	// Auto-rotate testimonials with pause on hover
	useEffect(() => {
		if (isDismissed || isPaused) return;

		const interval = setInterval(() => {
			setIsVisible(false);

			// Wait for exit animation to complete before changing testimonial
			setTimeout(() => {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
				setIsVisible(true);
			}, 300);
		}, 5000);

		return () => clearInterval(interval);
	}, [currentIndex, isDismissed, isPaused]);
	const goPrevious = () => {
		setIsVisible(false);
		setTimeout(() => {
			setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
			setIsVisible(true);
		}, 300);
	};
	const goNext = () => {
		setIsVisible(false);
		setTimeout(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
			setIsVisible(true);
		}, 300);
	};

	// Handle testimonial submission through the API
	const handleSubmitTestimonial = () => {
		toast({
			title: 'Testimonial Submission',
			description: 'Thank you for your interest! You can submit your testimonial after using our services.',
			variant: 'default',
			duration: 3000,
		});
	};

	// Save dismissed state to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('testimonialsDismissed', JSON.stringify(isDismissed));
	}, [isDismissed]);

	if (isDismissed) {
		return (
			<div className="fixed bottom-4 right-4 z-40">				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setIsDismissed(false);
						// Explicitly set localStorage value
						localStorage.setItem('testimonialsDismissed', JSON.stringify(false));
					}}
					className="bg-white/80 border-rose text-burgundy hover:bg-white hover:text-deep-rose"
				>
					<MessageSquare className="w-4 h-4 mr-2" />
					Show Reviews
				</Button>
			</div>
		);
	}

	// Show loading state
	if (isLoading) {
		return (
			<div className="fixed bottom-4 right-4 z-40 max-w-[300px] sm:max-w-[320px] md:max-w-[350px]">
				<Card className="subtle-elevation border border-rose bg-white/90 backdrop-blur-sm shadow-lg p-4">
					<div className="flex items-center justify-center h-24">
						<div className="animate-pulse text-center">
							{/* <Heart className="h-8 w-8 text-burgundy mx-auto mb-2" /> */}
							<p className="text-deep-rose text-sm">Loading testimonials...</p>
						</div>
					</div>
				</Card>
			</div>
		);
	}

	// Show error state with retry button
	if (error) {
		return (
			<div className="fixed bottom-4 right-4 z-40 max-w-[300px] sm:max-w-[320px] md:max-w-[350px]">
				<Card className="subtle-elevation border border-rose bg-white/90 backdrop-blur-sm shadow-lg p-4">
					<div className="text-center">
						<p className="text-red-500 mb-2">{error}</p>
						<Button
							size="sm"
							variant="outline"
							onClick={fetchTestimonials}
							className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
						>
							<RefreshCcw className="w-3 h-3 mr-1" />
							Retry
						</Button>
					</div>
				</Card>
			</div>
		);
	}

	const currentTestimonial = testimonials[currentIndex];

	return (
		<div className="fixed bottom-4 right-4 z-40 max-w-[300px] sm:max-w-[320px] md:max-w-[350px] transition-all">
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.3 }}
						className="w-full"
						whileHover={{ scale: 1.02 }}
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						<Card className="subtle-elevation border border-rose bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden romantic-card-accent hover:shadow-xl transition-shadow">
							<div className="absolute -top-6 -right-6 w-12 h-12 bg-burgundy rounded-full" />
							<div className="absolute -bottom-6 -left-6 w-12 h-12 bg-rose/50 rounded-full" />							<button
								onClick={(e) => {
									e.stopPropagation(); // Prevent event bubbling
									setIsDismissed(true);
									// Explicitly set localStorage value
									localStorage.setItem('testimonialsDismissed', JSON.stringify(true));
								}}
								className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 rounded-full w-6 h-6 flex items-center justify-center z-10"
								aria-label="Close testimonials"
							>
								<X size={14} />
							</button>							<div className="p-4 relative z-10">
								<div className="flex gap-3 items-start mb-2">
									<div className="w-10 h-10 rounded-full overflow-hidden gradient-warm flex-shrink-0 border-2 border-blush-pink">
										<img
											src={currentTestimonial.avatar}
											alt={currentTestimonial.name}
											className="w-full h-full object-cover"
										/>
									</div>

									<div>
										<h4 className="text-sm font-semibold text-foreground">
											{currentTestimonial.name}
										</h4>
										<p className="text-xs text-muted-foreground">
											{currentTestimonial.role}
										</p>
									</div>
								</div>

								<div className="flex items-center justify-between mb-2">
									<div className="flex">
										{Array.from({ length: 5 }).map((_, i) => (
											<Star
												key={i}
												size={12}
												className={`${
													i < currentTestimonial.rating
														? 'text-yellow-500 fill-yellow-500'
														: 'text-gray-300'
												}`}
											/>
										))}
									</div>
									<span className="text-xs text-muted-foreground italic">
										{currentTestimonial.date}
									</span>
								</div>

								<div className="relative px-3">
									{/* Navigation controls */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											goPrevious();
										}}
										className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center hover:bg-burgundy/10 transition-colors"
										aria-label="Previous testimonial"
									>
										<ChevronLeft size={14} className="text-burgundy" />
									</button>

									<p className="text-sm text-gray-600 italic leading-relaxed min-h-[60px]">
										"{currentTestimonial.content}"
									</p>

									<button
										onClick={(e) => {
											e.stopPropagation();
											goNext();
										}}
										className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center hover:bg-burgundy/10 transition-colors"
										aria-label="Next testimonial"
									>
										<ChevronRight size={14} className="text-burgundy" />
									</button>
								</div>
								<div className="flex flex-col gap-2 mt-3">
									<div className="flex justify-center items-center relative">
										<div className="flex">
											{testimonials.map((_, idx) => (
												<button
													key={idx}
													className="mx-1"
													onClick={() => {
														setIsVisible(false);
														setTimeout(() => {
															setCurrentIndex(idx);
															setIsVisible(true);
														}, 300);
													}}
												>
													<span
														className={`block w-2 h-2 rounded-full transition-all ${
															idx === currentIndex
																? 'bg-burgundy scale-125'
																: 'bg-gray-300 hover:bg-burgundy/50'
														}`}
													/>
												</button>
											))}
										</div>

										{/* Auto-rotation indicator */}
										<div
											className="absolute -right-4 w-2 h-2 rounded-full flex items-center justify-center"
											title={isPaused ? 'Auto-rotation paused' : 'Auto-rotating'}
										>
											<span
												className={`w-full h-full rounded-full ${
													isPaused ? 'bg-gray-300' : 'bg-green-500 animate-pulse'
												}`}
											></span>
										</div>
									</div>

									{/* Add your own testimonial button */}
									<Button
										variant="ghost"
										size="sm"
										onClick={handleSubmitTestimonial}
										className="text-xs text-burgundy hover:bg-rose/20 mt-1"
									>
										<MessageSquare className="w-3 h-3 mr-1" />
										Share Your Experience
									</Button>
								</div>
							</div>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Testimonials;
