class Slider {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.slides = config.slides || [];
        this.intervalTime = config.intervalTime || 3000;
        this.currentSlide = 0;
        this.intervalId = null;
        this.isPlaying = true;

        this.init();
    }

    init() {
        this.createSliderElements();
        this.showSlide(this.currentSlide);
        this.startAutoPlay();
        this.addEventListeners();
    }

    createSliderElements() {
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider-wrapper';

        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'slides';

        this.slides.forEach((slide) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            const img = document.createElement('img');
            img.src = slide;
            slideElement.appendChild(img);
            slidesContainer.appendChild(slideElement);
        });

        sliderWrapper.appendChild(slidesContainer);

        const prevButton = document.createElement('button');
        prevButton.className = 'control prev';
        prevButton.textContent = '‹';
        prevButton.addEventListener('click', () => this.prevSlide());

        const nextButton = document.createElement('button');
        nextButton.className = 'control next';
        nextButton.textContent = '›';
        nextButton.addEventListener('click', () => this.nextSlide());

        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'indicators';

        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.dataset.slide = index;
            indicator.addEventListener('click', () => this.goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const pausePlayButton = document.createElement('button');
        pausePlayButton.className = 'pause-play';
        pausePlayButton.textContent = '❚❚';
        pausePlayButton.addEventListener('click', () => this.togglePlayPause());

        sliderWrapper.appendChild(prevButton);
        sliderWrapper.appendChild(nextButton);
        sliderWrapper.appendChild(indicatorsContainer);
        sliderWrapper.appendChild(pausePlayButton);

        this.container.appendChild(sliderWrapper);
    }

    showSlide(index) {
        const slides = this.container.querySelectorAll('.slide');
        const indicators = this.container.querySelectorAll('.indicator');

        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.intervalId = setInterval(() => this.nextSlide(), this.intervalTime);
    }

    stopAutoPlay() {
        clearInterval(this.intervalId);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.stopAutoPlay();
            this.container.querySelector('.pause-play').textContent = '►';
        } else {
            this.startAutoPlay();
            this.container.querySelector('.pause-play').textContent = '❚❚';
        }
        this.isPlaying = !this.isPlaying;
    }

    resetAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (event.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        this.container.addEventListener('mouseover', () => {
            this.stopAutoPlay();
        });

        this.container.addEventListener('mouseout', () => {
            if (this.isPlaying) {
                this.startAutoPlay();
            }
        });
    }
}
class DragSlider extends Slider {
    constructor(containerId, config) {
        super(containerId, config);
        this.initDrag();
    }

    initDrag() {
        const slidesContainer = this.container.querySelector('.slides');
        let startX = 0;

        slidesContainer.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            slidesContainer.addEventListener('mousemove', onDrag);
        });

        slidesContainer.addEventListener('mouseup', () => {
            slidesContainer.removeEventListener('mousemove', onDrag);
        });

        const onDrag = (e) => {
            const deltaX = e.clientX - startX;
            if (deltaX > 50) {
                this.prevSlide();
                slidesContainer.removeEventListener('mousemove', onDrag);
            } else if (deltaX < -50) {
                this.nextSlide();
                slidesContainer.removeEventListener('mousemove', onDrag);
            }
        };
    }
}

const slider = new Slider('slider-container', {
    slides: [
        'img/1.png',
        'img/2.png',
        'img/3.png',
        'img/4.png',
        'img/5.png',
    ],
    intervalTime: 3000
});
new DragSlider('slider', config);