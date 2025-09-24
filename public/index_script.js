document.addEventListener('DOMContentLoaded', function() {
  // Animation for elements when they come into view
  function animateOnScroll() {
    // Add animate-element class to elements we want to animate
    const elementsToAnimate = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item, .section-header');
    
    elementsToAnimate.forEach(element => {
      element.classList.add('animate-element');
    });
    
    // Check if elements are visible and add visible class
    function checkScroll() {
      elementsToAnimate.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // How many pixels should be visible before triggering
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    }
    
    // Run once on load
    checkScroll();
    
    // Run on scroll
    window.addEventListener('scroll', checkScroll);
  }
  
  // Smooth scrolling for anchor links
  function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // Counter animation for statistics
  function animateCounters() {
    const statItems = document.querySelectorAll('.stat-item h3');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseFloat(target.textContent.replace(/[^0-9.]/g, ''));
          let startValue = 0;
          let duration = 2000; // 2 seconds
          let decimals = target.textContent.includes('.') ? 1 : 0;
          let prefix = '';
          let suffix = '';
          
          // Check for prefixes like $
          if (target.textContent.includes('$')) {
            prefix = '$';
          }
          
          // Check for suffixes like k, M, %
          if (target.textContent.includes('k')) {
            suffix = 'k+';
          } else if (target.textContent.includes('M')) {
            suffix = 'M';
          } else if (target.textContent.includes('%')) {
            suffix = '%';
          } else if (target.textContent.includes('/')) {
            const parts = target.textContent.split('/');
            suffix = '/' + parts[1];
          } else if (target.textContent.includes('+')) {
            suffix = '+';
          }
          
          const startTime = performance.now();
          
          function updateCount(timestamp) {
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = startValue + (countTo - startValue) * progress;
            
            target.textContent = `${prefix}${currentCount.toFixed(decimals)}${suffix}`;
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          }
          
          requestAnimationFrame(updateCount);
          observer.unobserve(target); // Stop observing once animation started
        }
      });
    }, { threshold: 0.5 });
    
    statItems.forEach(item => {
      observer.observe(item);
    });
  }
  
  // Header scroll effect
  function headerScrollEffect() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      }
    });
  }
  
  // Mobile menu toggle
  function mobileMenuSetup() {
    const header = document.querySelector('.header');
    const menuButton = document.createElement('button');
    menuButton.classList.add('menu-toggle');
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';
    menuButton.style.background = 'none';
    menuButton.style.border = 'none';
    menuButton.style.fontSize = '1.5rem';
    menuButton.style.cursor = 'pointer';
    menuButton.style.color = 'var(--dark-color)';
    
    const nav = document.querySelector('.nav');
    
    function toggleMenu() {
      if (nav.style.display === 'block') {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'block';
      }
    }
    
    menuButton.addEventListener('click', toggleMenu);
    
    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        if (!header.contains(menuButton)) {
          header.appendChild(menuButton);
        }
        menuButton.style.display = 'block';
        nav.style.display = 'none';
        
        // Position the expanded menu
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.backgroundColor = 'white';
        nav.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        nav.style.padding = '1rem 0';
        
        // Style the nav list for mobile
        const navList = nav.querySelector('ul');
        navList.style.flexDirection = 'column';
        navList.style.alignItems = 'center';
        
        const navItems = navList.querySelectorAll('li');
        navItems.forEach(item => {
          item.style.margin = '0.5rem 0';
        });
      } else {
        menuButton.style.display = 'none';
        nav.style.display = 'block';
        
        // Reset nav styles
        nav.style.position = 'static';
        nav.style.width = 'auto';
        nav.style.backgroundColor = 'transparent';
        nav.style.boxShadow = 'none';
        nav.style.padding = '0';
        
        const navList = nav.querySelector('ul');
        navList.style.flexDirection = 'row';
        
        const navItems = navList.querySelectorAll('li');
        navItems.forEach(item => {
          item.style.margin = '0';
        });
      }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  }
  
  // Initialize all functions
  animateOnScroll();
  setupSmoothScrolling();
  animateCounters();
  headerScrollEffect();
  mobileMenuSetup();

  // Scroll Animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once animation is triggered
      }
    });
  }, {
    threshold: 0.1 // Trigger when at least 10% of the element is visible
  });

  // Observe all elements with animate-element class
  document.querySelectorAll('.animate-element').forEach((element) => {
    observer.observe(element);
  });
});