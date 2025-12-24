// Christmas Season Snowfall Effect
// Based on main.js Christmas feature
(function() {
  'use strict';

  const CONFIG = {
    CHRISTMAS_START_DAY: 20,
    CHRISTMAS_END_DAY: 26,
    SNOWFLAKE_COUNT: 15,
  };

  // Check if it's Christmas season (December 20-26)
  function isChristmasSeason() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();
    return month === 11 && day >= CONFIG.CHRISTMAS_START_DAY && day <= CONFIG.CHRISTMAS_END_DAY;
  }

  // Create snowfall effect on header
  function createSnowfall() {
    if (!isChristmasSeason()) {
      console.log('Not Christmas season - snowfall disabled');
      return;
    }

    const header = document.querySelector('.header');
    if (!header) return;

    // Prevent duplicate snow containers
    if (document.getElementById('aws-snow-container')) return;

    // Add snow container
    const snowContainer = document.createElement('div');
    snowContainer.id = 'aws-snow-container';
    snowContainer.style.cssText = `
      position: absolute;
      top: -30px;
      left: 0;
      width: 100%;
      height: calc(100% + 30px);
      overflow: hidden;
      pointer-events: none;
      z-index: 1000;
    `;

    // Add CSS animation - more natural snowfall with gentle sway
    const style = document.createElement('style');
    style.id = 'aws-snow-styles';
    style.textContent = `
      @keyframes aws-snowfall {
        0% {
          transform: translateY(-30px) translateX(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          transform: translateY(25px) translateX(10px) rotate(180deg);
          opacity: 0.9;
        }
        80% {
          opacity: 0.7;
        }
        100% {
          transform: translateY(80px) translateX(-5px) rotate(360deg);
          opacity: 0;
        }
      }
      @keyframes aws-snowfall-alt {
        0% {
          transform: translateY(-30px) translateX(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        50% {
          transform: translateY(25px) translateX(-10px) rotate(-180deg);
          opacity: 0.9;
        }
        80% {
          opacity: 0.7;
        }
        100% {
          transform: translateY(80px) translateX(5px) rotate(-360deg);
          opacity: 0;
        }
      }
      .aws-snowflake {
        position: absolute;
        top: 0;
        color: white;
        text-shadow: 0 0 4px rgba(255,255,255,0.9);
        user-select: none;
        will-change: transform, opacity;
      }
      .aws-snowflake-left {
        animation: aws-snowfall ease-in-out infinite;
      }
      .aws-snowflake-right {
        animation: aws-snowfall-alt ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    // Create snowflakes with varied properties using DocumentFragment
    const snowflakes = ['❄', '❅', '❆', '✻', '✼', '❉'];
    const snowFragment = document.createDocumentFragment();

    for (let i = 0; i < CONFIG.SNOWFLAKE_COUNT; i++) {
      const flake = document.createElement('span');
      const isLeftSway = Math.random() > 0.5;
      const left = Math.random() * 100;
      const fontSize = 8 + Math.random() * 10;
      const duration = 4 + Math.random() * 4;
      const delay = Math.random() * 5;

      flake.className = `aws-snowflake ${isLeftSway ? 'aws-snowflake-left' : 'aws-snowflake-right'}`;
      flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
      flake.style.cssText = `left:${left}%;font-size:${fontSize}px;animation-duration:${duration}s;animation-delay:${delay}s;`;
      snowFragment.appendChild(flake);
    }
    snowContainer.appendChild(snowFragment);

    // Make header position relative for absolute positioning of snow
    header.style.position = 'relative';
    header.appendChild(snowContainer);

    console.log('🎄 Christmas snow effect enabled! (Dec 20-26)');
  }

  // Initialize snowfall when DOM is ready
  function init() {
    createSnowfall();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
