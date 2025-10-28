/**
 * Fuhrmanns Hof - Galerie Lightbox
 * Automatische Lightbox für alle .gallery a-Links
 */

class GalleryLightbox {
  constructor() {
    this.lightbox = null;
    this.images = [];
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    // Nur auf Galerie-Seite initialisieren
    if (!document.querySelector('.gallery')) return;

    // Alle Galerie-Links sammeln
    this.collectImages();
    
    // Lightbox-Element erstellen
    this.createLightbox();
    
    // Event-Listener hinzufügen
    this.attachEvents();
  }

  collectImages() {
    // Alle Links in .gallery sammeln
    const links = document.querySelectorAll('.gallery a');
    
    this.images = Array.from(links).map(link => {
      const img = link.querySelector('img');
      const caption = link.querySelector('figcaption');
      
      return {
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : ''
      };
    });
  }

  createLightbox() {
    // Lightbox-HTML erstellen
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Schließen">&times;</button>
      <button class="lightbox-prev" aria-label="Vorheriges Bild">‹</button>
      <button class="lightbox-next" aria-label="Nächstes Bild">›</button>
      <div class="lightbox-content">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
      <div class="lightbox-counter"></div>
    `;
    
    document.body.appendChild(this.lightbox);
  }

  attachEvents() {
    // Click-Events auf Galerie-Links
    document.querySelectorAll('.gallery a').forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });
    });

    // Lightbox-Controls
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');

    closeBtn.addEventListener('click', () => this.close());
    prevBtn.addEventListener('click', () => this.prev());
    nextBtn.addEventListener('click', () => this.next());

    // Click auf Hintergrund schließt
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    // Keyboard-Navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    });

    // Touch-Events für Swipe
    const content = this.lightbox.querySelector('.lightbox-content');
    
    content.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    content.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next(); // Swipe left = next
      } else {
        this.prev(); // Swipe right = prev
      }
    }
  }

  open(index) {
    this.currentIndex = index;
    this.updateImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  updateImage() {
    const img = this.lightbox.querySelector('.lightbox-content img');
    const caption = this.lightbox.querySelector('.lightbox-caption');
    const counter = this.lightbox.querySelector('.lightbox-counter');
    const current = this.images[this.currentIndex];

    // Bild laden
    img.src = current.src;
    img.alt = current.alt;

    // Caption anzeigen (falls vorhanden)
    if (current.caption) {
      caption.textContent = current.caption;
      caption.style.display = 'block';
    } else {
      caption.style.display = 'none';
    }

    // Counter aktualisieren
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

    // Buttons ausblenden bei nur einem Bild
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');
    
    if (this.images.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }
}

// Initialisieren wenn DOM geladen ist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new GalleryLightbox();
    new GalleryNavigation();
  });
} else {
  new GalleryLightbox();
  new GalleryNavigation();
}

/**
 * Galerie-Navigation: Smooth Scroll & aktive Section
 */
class GalleryNavigation {
  constructor() {
    this.sections = [];
    this.sidebarLinks = [];
    this.dropdown = null;
    
    this.init();
  }

  init() {
    // Nur auf Galerie-Seite
    if (!document.querySelector('.gallery-sidebar')) return;

    // Sections und Links sammeln
    this.sections = Array.from(document.querySelectorAll('article[id]'));
    this.sidebarLinks = Array.from(document.querySelectorAll('.gallery-sidebar a'));
    this.dropdown = document.getElementById('eventDropdown');

    // Smooth Scroll für Sidebar-Links
    this.sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        this.scrollToSection(targetId);
      });
    });

    // Smooth Scroll für Dropdown
    if (this.dropdown) {
      this.dropdown.addEventListener('change', (e) => {
        if (e.target.value) {
          this.scrollToSection(e.target.value);
        }
      });
    }

    // Aktive Section beim Scrollen erkennen
    this.setupScrollSpy();
  }

  scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const offset = 90; // navbar + etwas Luft
    const targetPosition = target.offsetTop - offset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  setupScrollSpy() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            this.updateActiveLink(id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
      }
    );

    this.sections.forEach(section => observer.observe(section));
  }

  updateActiveLink(activeId) {
    // Sidebar-Links aktualisieren
    this.sidebarLinks.forEach(link => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Dropdown aktualisieren (mobile)
    if (this.dropdown) {
      this.dropdown.value = `#${activeId}`;
    }
  }
}