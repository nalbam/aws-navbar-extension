// Navbar color application with region selection
(function() {
  'use strict';

  const STORAGE_KEY = 'aws-navbar-selected-region';

  // Language code to country mapping
  const languageToCountry = {
    'en-US': 'united-states',
    'en-GB': 'united-kingdom',
    'en-AU': 'australia',
    'en-CA': 'canada',
    'en-NZ': 'new-zealand',
    'en-SG': 'singapore',
    'en-IN': 'india',
    'en-ZA': 'south-africa',
    'ko-KR': 'south-korea',
    'ko': 'south-korea',
    'ja-JP': 'japan',
    'ja': 'japan',
    'zh-CN': 'hong-kong',
    'zh-TW': 'taiwan',
    'zh-HK': 'hong-kong',
    'zh-SG': 'singapore',
    'de-DE': 'germany',
    'de-AT': 'germany',
    'de-CH': 'switzerland',
    'de': 'germany',
    'fr-FR': 'france',
    'fr-CA': 'canada',
    'fr-CH': 'switzerland',
    'fr-BE': 'france',
    'fr': 'france',
    'es-ES': 'spain',
    'es-MX': 'mexico',
    'es': 'spain',
    'it-IT': 'italy',
    'it-CH': 'switzerland',
    'it': 'italy',
    'pt-BR': 'brazil',
    'pt-PT': 'brazil',
    'pt': 'brazil',
    'sv-SE': 'sweden',
    'sv': 'sweden',
    'ar-AE': 'uae',
    'ar-BH': 'bahrain',
    'ar-SA': 'bahrain',
    'ar': 'uae',
    'he-IL': 'israel',
    'he': 'israel',
    'th-TH': 'thailand',
    'th': 'thailand',
    'id-ID': 'indonesia',
    'id': 'indonesia',
    'ms-MY': 'malaysia',
    'ms': 'malaysia',
    'hi-IN': 'india',
    'hi': 'india',
    'en': 'global'
  };

  // Get browser language
  function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage;
  }

  // Map language to country
  function getCountryFromLanguage(language) {
    if (languageToCountry[language]) {
      return languageToCountry[language];
    }
    const languageCode = language.split('-')[0];
    if (languageToCountry[languageCode]) {
      return languageToCountry[languageCode];
    }
    return 'global';
  }

  // Find region by country name
  function findRegionByCountry(country) {
    for (const [region, data] of Object.entries(colors)) {
      if (data.country === country) {
        return region;
      }
    }
    return 'global';
  }

  // Get auto-detected region
  function getAutoRegion() {
    const language = getBrowserLanguage();
    const country = getCountryFromLanguage(language);
    return findRegionByCountry(country);
  }

  // Saved choice: 'auto' or a region in colors. A saved region that colors no
  // longer has (for example, a removed region code) counts as 'auto'.
  function getSavedChoice() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && colors[saved] ? saved : 'auto';
  }

  // Region to show: the saved region, or the region of the browser language
  function getSelectedRegion() {
    const choice = getSavedChoice();
    return choice === 'auto' ? getAutoRegion() : choice;
  }

  // Apply gradient to header
  function applyHeaderGradient(region) {
    const regionData = colors[region];
    if (!regionData) {
      console.warn('Region not found:', region);
      return;
    }

    // Same vivid theme as the extension: readable background behind white text.
    const theme = getNavbarTheme(regionData.colors, 'vivid');
    const header = document.querySelector('.header');

    if (header) {
      header.style.background = theme.background;
      header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';

      const logo = header.querySelector('.logo');
      const logoLink = logo ? logo.querySelector('a') : null;
      const navLinks = header.querySelectorAll('.nav a');

      if (logo) {
        logo.style.color = theme.foreground;
      }
      if (logoLink) {
        logoLink.style.color = theme.foreground;
      }

      navLinks.forEach(link => {
        link.style.color = theme.foreground;
      });
    }
  }

  // Update selector display
  function updateSelectorDisplay(region) {
    const selectorText = document.getElementById('selected-region');
    if (!selectorText) return;

    selectorText.innerHTML = '';

    if (getSavedChoice() === 'auto') {
      const autoRegion = getAutoRegion();
      const autoData = colors[autoRegion];

      const flagImg = document.createElement('img');
      flagImg.src = `images/flags/${autoData.country}.png`;
      flagImg.alt = autoData.country;
      flagImg.style.width = '20px';
      flagImg.style.height = '20px';
      flagImg.style.objectFit = 'cover';
      flagImg.style.borderRadius = '2px';
      flagImg.style.marginRight = '6px';
      flagImg.onerror = function() {
        this.outerHTML = `<span style="margin-right:6px;">${autoData.emoji}</span>`;
      };

      selectorText.appendChild(flagImg);
      selectorText.appendChild(document.createTextNode(`Auto (${autoData.name})`));
    } else {
      const regionData = colors[region];
      if (regionData) {
        const flagImg = document.createElement('img');
        flagImg.src = `images/flags/${regionData.country}.png`;
        flagImg.alt = regionData.country;
        flagImg.style.width = '20px';
        flagImg.style.height = '20px';
        flagImg.style.objectFit = 'cover';
        flagImg.style.borderRadius = '2px';
        flagImg.style.marginRight = '6px';
        flagImg.onerror = function() {
          this.outerHTML = `<span style="margin-right:6px;">${regionData.emoji}</span>`;
        };

        selectorText.appendChild(flagImg);
        selectorText.appendChild(document.createTextNode(regionData.name));
      }
    }
  }

  // Populate region selector
  function populateRegionSelector() {
    const selector = document.getElementById('region-selector');
    if (!selector) return;

    const optionsList = selector.querySelector('.selector-options');
    if (!optionsList) return;

    // Create Auto option
    const autoLi = document.createElement('li');
    autoLi.id = 'region-option-auto';
    autoLi.className = 'selector-option';
    autoLi.setAttribute('role', 'option');
    autoLi.setAttribute('data-value', 'auto');
    const autoRegion = getAutoRegion();
    const autoData = colors[autoRegion];

    const autoFlagImg = document.createElement('img');
    autoFlagImg.src = `images/flags/${autoData.country}.png`;
    autoFlagImg.alt = autoData.country;
    autoFlagImg.className = 'region-flag';
    autoFlagImg.onerror = function() {
      this.outerHTML = `<span class="region-flag" style="width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;">${autoData.emoji}</span>`;
    };

    const autoTextSpan = document.createElement('span');
    autoTextSpan.textContent = `Auto - ${autoData.name}`;

    autoLi.appendChild(autoFlagImg);
    autoLi.appendChild(autoTextSpan);
    optionsList.appendChild(autoLi);

    // Create divider
    const divider = document.createElement('li');
    divider.setAttribute('aria-hidden', 'true');
    divider.style.height = '1px';
    divider.style.backgroundColor = 'var(--border)';
    divider.style.margin = '8px 0';
    optionsList.appendChild(divider);

    // Create region options
    const sortedRegions = Object.keys(colors).sort();
    sortedRegions.forEach(region => {
      const data = colors[region];
      const li = document.createElement('li');
      li.id = `region-option-${region}`;
      li.className = 'selector-option';
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', region);

      const flagImg = document.createElement('img');
      flagImg.src = `images/flags/${data.country}.png`;
      flagImg.alt = data.country;
      flagImg.className = 'region-flag';
      flagImg.onerror = function() {
        // Fallback to emoji if image fails
        this.outerHTML = `<span class="region-flag" style="width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;">${data.emoji}</span>`;
      };

      const textSpan = document.createElement('span');
      textSpan.textContent = `${region} - ${data.name}`;

      li.appendChild(flagImg);
      li.appendChild(textSpan);
      optionsList.appendChild(li);
    });

    // Setup event listeners
    setupSelectorEvents(selector, optionsList);
  }

  // Setup selector event listeners. Keyboard focus stays on the combobox; the
  // active option is the one that the arrow keys point to, and
  // aria-activedescendant tells screen readers which one.
  function setupSelectorEvents(selector, optionsList) {
    const trigger = selector.querySelector('.selector-trigger');
    const options = Array.from(optionsList.querySelectorAll('.selector-option'));
    let activeIndex = -1;

    const setActiveOption = (index) => {
      activeIndex = index;
      options.forEach((opt, i) => opt.classList.toggle('focused', i === index));
      if (index >= 0) {
        selector.setAttribute('aria-activedescendant', options[index].id);
        options[index].scrollIntoView({ block: 'nearest' });
      } else {
        selector.removeAttribute('aria-activedescendant');
      }
    };

    // Open or close the list. An opened list starts at the selected option.
    const toggleDropdown = (open) => {
      const isOpen = open !== undefined ? open : selector.getAttribute('aria-expanded') !== 'true';
      selector.setAttribute('aria-expanded', isOpen);
      setActiveOption(isOpen ? options.findIndex(opt => opt.classList.contains('selected')) : -1);
    };

    const selectOption = (option) => {
      const value = option.getAttribute('data-value');
      localStorage.setItem(STORAGE_KEY, value);

      const region = value === 'auto' ? getAutoRegion() : value;
      applyHeaderGradient(region);
      updateSelectorDisplay(region);

      options.forEach(opt => {
        opt.setAttribute('aria-selected', opt === option);
        opt.classList.toggle('selected', opt === option);
      });
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    optionsList.addEventListener('click', (e) => {
      const option = e.target.closest('.selector-option');
      if (option) selectOption(option);
      toggleDropdown(false);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    // Keyboard: Enter/Space select the active option (or open the list),
    // arrows/Home/End move, Escape closes, Tab closes and moves on.
    selector.addEventListener('keydown', (e) => {
      const isOpen = selector.getAttribute('aria-expanded') === 'true';
      const last = options.length - 1;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && activeIndex >= 0) {
            selectOption(options[activeIndex]);
            toggleDropdown(false);
          } else {
            toggleDropdown();
          }
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown(true);
          } else if (activeIndex === -1) {
            setActiveOption(e.key === 'ArrowDown' ? 0 : last);
          } else {
            const step = e.key === 'ArrowDown' ? 1 : -1;
            setActiveOption((activeIndex + step + options.length) % options.length);
          }
          break;
        case 'Home':
        case 'End':
          if (isOpen) {
            e.preventDefault();
            setActiveOption(e.key === 'Home' ? 0 : last);
          }
          break;
        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            toggleDropdown(false);
          }
          break;
        case 'Tab':
          if (isOpen) toggleDropdown(false);
          break;
      }
    });

    // Mark current selection
    const selectedOption = optionsList.querySelector(`[data-value="${getSavedChoice()}"]`);
    if (selectedOption) {
      selectedOption.classList.add('selected');
      selectedOption.setAttribute('aria-selected', 'true');
    }
  }

  // Initialize
  function init() {
    const region = getSelectedRegion();
    applyHeaderGradient(region);
    updateSelectorDisplay(region);
    populateRegionSelector();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
