import { useRef, useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAntiTheft } from '@/hooks/useAntiTheft';
import { extractColors } from '@/utils/colorExtractor';

// Define types for our gallery items
type GalleryItem = {
  id: number;
  title: string;
  image: string;
  category: 'banners' | 'thumbnails';
};

// We're removing zoom levels as requested by the user

// Mock data for gallery items
const galleryItems: GalleryItem[] = [
  // Banners
  { id: 1, title: 'Pao\'s Banner', image: 'https://i.ibb.co/5X92n7nd/pao-afx.png', category: 'banners' },
  { id: 2, title: 'Kyoto\'s Banner', image: 'https://i.ibb.co/KpNdfjzP/kyoto-afx.png', category: 'banners' },
 // { id: 3, title: 'Banner', image: 'https://placehold.co/3500x1500/000000/ffffff?text=Banner', category: 'banners' },
 // { id: 4, title: 'Banner', image: 'https://placehold.co/3500x1500/000000/ffffff?text=Banner', category: 'banners' },
  
  // Thumbnails
  { id: 6, title: 'Youtube Thumbnail', image: 'https://i.ibb.co/TsFFt4H/dominating-afx.png', category: 'thumbnails' },
  { id: 7, title: 'Youtube Thumbnail', image: 'https://i.ibb.co/93Cv8rfj/thumbnail-settings-guide.png', category: 'thumbnails' },
  { id: 8, title: 'Game Thumbnail', image: 'https://i.ibb.co/W4zNHTB9/Drawing-28-sketchpad-1.png', category: 'thumbnails' },
  { id: 9, title: 'Game Thumbnail', image: 'https://i.ibb.co/LdvmRvd0/ya-afx.png', category: 'thumbnails' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<'banners' | 'thumbnails' | null>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  
  // Filter gallery items by selected category
  const filteredItems = selectedCategory 
    ? galleryItems.filter(item => item.category === selectedCategory)
    : [];
  
  // Handle category selection
  const handleCategorySelect = (category: 'banners' | 'thumbnails') => {
    setSelectedCategory(category);
    // Scroll to category section
    setTimeout(() => {
      if (categoryRef.current) {
        categoryRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };
  
  // Handle opening modal
  const handleOpenModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setModalOpen(true);
    setZoomIndex(0); // Reset zoom level
    
    // Extract colors from the image
    extractColors(item.image, 6).then(colors => {
      setColorPalette(colors);
    });
  };
  
  // Handle closing modal
  const handleCloseModal = () => {
    // Immediately make elements clickable by removing the modal from DOM
    // without waiting for animation to complete
    setModalOpen(false);
  };
  
  // We're removing the zoom functionality as requested by the user
  
  // We're removing the wheel zoom functionality as requested by the user
  // Instead, we'll only use the click-to-zoom button functionality
  
  // Use the anti-theft hook to protect images and prevent inspection
  useAntiTheft();
  
  // Prevent default browser behavior when modal is open
  const preventDefaultBehavior = (e: Event) => {
    if (modalOpen) {
      e.preventDefault();
      return false;
    }
    return true;
  };
  
  // Add wheel event listener for modal
  useEffect(() => {
    if (modalOpen) {
      window.addEventListener('wheel', preventDefaultBehavior, { passive: false });
    }
    
    return () => {
      window.removeEventListener('wheel', preventDefaultBehavior);
    };
  }, [modalOpen]); // Re-run when modalOpen changes
  
  // State for cursor position and magnifying glass
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  
  // State for color palette
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  
  // Ref for image container for magnifier calculations
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Magnifier settings
  const magnifierSize = 150; // Size of the magnifier in pixels
  const magnificationLevel = 1.2; // Reduced zoom level for the magnifier as requested by user
  
  // Handle mouse move for magnifying glass effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (imageRef.current && imageContainerRef.current) {
      const imageRect = imageRef.current.getBoundingClientRect();
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      
      // Calculate cursor position relative to the image
      const x = e.clientX - imageRect.left;
      const y = e.clientY - imageRect.top;
      
      // Check if cursor is over the image
      if (x >= 0 && x <= imageRect.width && y >= 0 && y <= imageRect.height) {
        setShowMagnifier(true);
        setCursorPosition({ x, y });
      } else {
        setShowMagnifier(false);
      }
    }
  };
  
  // Handle mouse leave for magnifying glass
  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <>
      <Head>
        <title>Portfolio | Banners & Thumbnails</title>
        <meta name="description" content="Minimalist portfolio of banners and thumbnails" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://i.ibb.co/gL8cKcnZ/origin-logo.png" />
        <style jsx global>{`
          img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            pointer-events: none;
          }
          body {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}</style>
      </Head>
      
      <main className="min-h-screen bg-white text-secondary">
        
        {/* Category Selector */}
        <div>
          {!selectedCategory ? (
            <motion.section 
              className="py-20 px-4 min-h-screen flex flex-col justify-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div 
                className="flex justify-center mb-16"
                variants={itemVariants}
              >
                <img src="https://i.ibb.co/cXVSxTWM/logo.png" alt="Logo" className="h-16 md:h-20 w-auto mx-auto" />
              </motion.div>
              
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Banners Category */}
                <motion.div 
                  className="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-stroke cursor-pointer"
                  variants={itemVariants}
                  whileHover="hover"
                  onClick={() => handleCategorySelect('banners')}
                >
                  <motion.div 
                    className="p-8 md:p-12 flex flex-col items-center text-center h-full"
                    variants={cardVariants}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-secondary">Banners</h3>
                    <p className="text-accent mb-6">Collection of custom banners</p>
                    <div className="mt-auto">
                      <span className="inline-block px-4 py-2 border border-stroke rounded-lg font-medium text-secondary hover:bg-secondary hover:text-white transition-colors">
                        View
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Thumbnails Category */}
                <motion.div 
                  className="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-stroke cursor-pointer"
                  variants={itemVariants}
                  whileHover="hover"
                  onClick={() => handleCategorySelect('thumbnails')}
                >
                  <motion.div 
                    className="p-8 md:p-12 flex flex-col items-center text-center h-full"
                    variants={cardVariants}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-secondary">Thumbnails</h3>
                    <p className="text-accent mb-6">Collection of custom thumbnails</p>
                    <div className="mt-auto">
                      <span className="inline-block px-4 py-2 border border-stroke rounded-lg font-medium text-secondary hover:bg-secondary hover:text-white transition-colors">
                        View
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.section>
          ) : (
            <motion.section 
              className="py-20 px-4 min-h-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="max-w-6xl mx-auto">
                <motion.div 
                  className="flex items-center mb-12"
                  variants={itemVariants}
                >
                  <motion.button
                    className="flex items-center text-lg font-medium text-secondary hover:text-accent transition-colors"
                    onClick={handleBackToCategories}
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back
                  </motion.button>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-12 capitalize text-secondary"
                  variants={itemVariants}
                >
                  {selectedCategory}
                </motion.h2>
                
                <motion.div 
                  className="grid grid-cols-1 gap-8"
                  variants={containerVariants}
                >
                  {filteredItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      className="gallery-item cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.3 } }}
                      onClick={() => handleOpenModal(item)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-auto object-cover"
                      />
                      <div className="gallery-item-overlay">
                        <div className="text-secondary text-center p-4">
                          <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                          <span className="inline-block px-3 py-1 bg-white text-secondary rounded-sm text-sm font-medium">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>
          )}
        </div>
        
        {/* Discord Contact */}
        <footer className="py-8 px-4 text-center mt-10">
          <div className="container mx-auto">
            <a 
              href="https://discord.gg/RRKGdTVY" 
              className="flex items-center justify-center px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-sm transition-colors mx-auto w-fit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              <span className="font-medium text-secondary">Portfolio Server</span>
            </a>
          </div>
        </footer>
        
        {/* Image Modal */}
        <AnimatePresence mode="sync">
          {modalOpen && selectedItem && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
            >
              {/* Backdrop */}
              <motion.div 
                className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                onClick={handleCloseModal}
              />
              
              {/* Modal Content */}
              <motion.div
                className="relative z-10 max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0 } }}
                transition={{ type: 'spring', damping: 25 }}
              >
                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-colors"
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
                
                {/* Removed zoom button as requested */}
                
                {/* Image Container */}
                <div 
                  className="relative overflow-hidden h-full flex items-center justify-center"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  ref={imageContainerRef}
                >
                  <div className="relative">
                    <img 
                      ref={imageRef}
                      src={selectedItem.image} 
                      alt={selectedItem.title}
                      className="max-w-full max-h-[80vh] object-contain"
                      style={{ 
                        filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.3))'
                      }}
                    />
                    
                    {/* Magnifying Glass */}
                    {showMagnifier && (
                      <div
                        style={{
                          position: 'absolute',
                          left: cursorPosition.x - magnifierSize / 2,
                          top: cursorPosition.y - magnifierSize / 2,
                          width: `${magnifierSize}px`,
                          height: `${magnifierSize}px`,
                          border: '2px solid white',
                          borderRadius: '50%',
                          pointerEvents: 'none',
                          overflow: 'hidden',
                          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                          zIndex: 10
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: `${-cursorPosition.x * magnificationLevel + magnifierSize / 2}px`,
                            top: `${-cursorPosition.y * magnificationLevel + magnifierSize / 2}px`,
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <img
                            src={selectedItem.image}
                            alt="magnified"
                            style={{
                              width: `${imageRef.current?.width ? imageRef.current.width * magnificationLevel : 0}px`,
                              height: `${imageRef.current?.height ? imageRef.current.height * magnificationLevel : 0}px`,
                              maxWidth: 'none',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Caption */}
                <motion.div 
                  className="bg-black bg-opacity-50 p-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-1 text-center">{selectedItem.title}</h3>
                  <p className="text-gray-300 text-sm text-center mb-3">
                    Hover over image to inspect details with magnifying glass
                  </p>
                  
                  {/* Color Palette - Smaller and at the bottom */}
                  <div className="mt-2 flex justify-center items-center gap-2 flex-wrap">
                    {colorPalette.map((color, index) => (
                      <div 
                        key={index} 
                        className="color-swatch relative group"
                        onClick={() => {
                          navigator.clipboard.writeText(color)
                            .then(() => {
                              console.log('Color copied to clipboard');
                            })
                            .catch(err => console.error('Failed to copy color: ', err));
                        }}
                      >
                        <div 
                          className="w-8 h-8 rounded-md cursor-pointer border border-white shadow-sm transition-all duration-300 transform hover:scale-110 hover:shadow-md"
                          style={{ backgroundColor: color }}
                          title={`Click to copy: ${color}`}
                        />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {color}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-300 text-xs text-center mt-1">Click any color to copy</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}