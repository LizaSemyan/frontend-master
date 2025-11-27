document.addEventListener('DOMContentLoaded', function() {
            // Sample data for slides
            
            
            const sliderTrack = document.getElementById('sliderTrack');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const indicatorsContainer = document.getElementById('indicators');
            
            let currentPosition = 0;
            const visibleSlides = 6;
            const totalSlides = slidesData.length;
            
            // Create slides
           
            // Create indicators
            for (let i = 0; i < totalSlides - visibleSlides + 1; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (i === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
            
            // Update slider position
            function updateSliderPosition() {
                sliderTrack.style.transform = `translateX(-${currentPosition * (100 / visibleSlides)}%)`;
                
                // Update active indicator
                document.querySelectorAll('.indicator').forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === currentPosition);
                });
            }
            
            // Go to specific slide
            function goToSlide(position) {
                currentPosition = position;
                updateSliderPosition();
            }
            
            // Next slide
            function nextSlide() {
                currentPosition = (currentPosition + 1) % (totalSlides - visibleSlides + 1);
                updateSliderPosition();
            }
            
            // Previous slide
            function prevSlide() {
                currentPosition = (currentPosition - 1 + (totalSlides - visibleSlides + 1)) % (totalSlides - visibleSlides + 1);
                updateSliderPosition();
            }
            
            // Event listeners
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
            });
            
            // Initialize slider
            updateSliderPosition();
        });