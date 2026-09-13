'use strict';

document.addEventListener('DOMContentLoaded', () => {
   console.log('DOMContentLoaded is loaded and ready to use');

   const testimonialSlider = document.getElementById('testimonial-slider');
   const testimonialCarousel = document.getElementById('testimonial-carousel');
   const prevButton = document.getElementById('prev-button');
   const nextButton = document.getElementById('next-button');

   const firstCard = testimonialCarousel.querySelector('.testimonial-card')
   const firstCardWidth = firstCard.offsetWidth;

   let isDragging = false;
   let startX;
   let startScrollLeft;

});