import { useState, useEffect, useRef } from 'react';

const ProductImageSlide = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false); // เพิ่ม State สำหรับเช็คการหยุด
    const intervalRef = useRef(null);

    const extendedImages = images && images.length > 0 
        ? [images[images.length - 1], ...images, images[0]] 
        : [];

    // ฟังก์ชันสำหรับเริ่มเลื่อน
    const startSlider = () => {
        if (!images || images.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => prev + 1);
            setIsTransitioning(true);
        }, 8000);
    };

    // ฟังก์ชันสำหรับหยุดเลื่อน
    const stopSlider = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
        if (!isPaused) {
            startSlider();
        } else {
            stopSlider();
        }
        return () => stopSlider();
    }, [isPaused, images]);

    useEffect(() => {
        if (currentIndex === extendedImages.length - 1) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, 700); 
        }
    }, [currentIndex, extendedImages.length]);

    if (!images || images.length === 0) return null;

    return (
        <div 
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}  // หยุดเมื่อ Hover
            onMouseLeave={() => setIsPaused(false)} // เล่นต่อเมื่อเอาเมาส์ออก
        >
            <div 
                className={`flex w-full h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {extendedImages.map((image, index) => (
                    <div key={index} className="w-full h-full flex-shrink-0">
                        <img
                            src={image.imageUrl}
                            alt="Product"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductImageSlide;