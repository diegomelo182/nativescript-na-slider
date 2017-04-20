// MODULES
const gridLayoutModule = require("ui/layouts/grid-layout");
const StackLayout = require("ui/layouts/stack-layout").StackLayout;
const ScrollView = require("ui/scroll-view").ScrollView;
const utils = require("utils/utils");


const NASliderModule = {};

// SLIDER
NASliderModule.NASlider = (function(_super) {
  __extends(NASlider, _super);
  function NASlider() {
    const _this = _super !== null && _super.apply(this, arguments) || this;
    
    _this._initialized = false;
    _this._hasRepeater = null;
    _this._currentSlideIndex = 0;
    _this._scrollView = new ScrollView();
    _this._slidesContainer = null;
    _this._slides = [];
    _this._slidePositions = [];
    _this._scrollPosition = 0;
    _this._orientation = "horizontal";
    _this._bounce = false;
    _this._forceFirstIndicatorVisibility = false;
    _this._showIndicators = true;
    _this._indicatorsContainer = new StackLayout();
    _this._indicatorSize = 8;
    _this._indicatorPosition = "bottom";
    _this._indicatorHorizontalAlignment = null;
    _this._indicatorVerticalAlignment = null;
    _this._indicatorColor = "#808080";
    _this._indicatorColorActive = null;
    _this._indicatorBorderWidth = 0;
    _this._indicatorBorderColor = "#404040";

    _this._init();

    return _this;
  }
  
  Object.defineProperty(NASlider.prototype, "items", {
    get: function() { return this._getRepeater().items; },
    set: function(value) {
      const repeater = this._getRepeater();

      if(repeater) {
        repeater.items = value;
      } else {
        console.error(new Error("Repeater inside NASlider requires items to be assigned to the NASlider itself."));
      }
    },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "currentSlide", {
    get: function() { return this._slides[this.currentSlideIndex]; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "currentSlideIndex", {
    get: function() { return this._currentSlideIndex; },
    enumerable: true, configurable: true
  });

  Object.defineProperty(NASlider.prototype, "slidesCount", {
    get: function() { return this._slides.length; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "scrollPosition", {
    get: function() { return this._scrollPosition; },
    enumerable: true, configurable: true
  });

  Object.defineProperty(NASlider.prototype, "orientation", {
    get: function() { return this._orientation; },
    set: function(value) { this._orientation = value === "vertical" ? "vertical" : "horizontal"; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "bounce", {
    get: function() { return this._bounce; },
    set: function(value) { this._bounce = value === true ? true : false; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "forceFirstIndicatorVisibility", {
    get: function() { return this._forceFirstIndicatorVisibility; },
    set: function(value) { this._forceFirstIndicatorVisibility = value === true ? true : false; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "showIndicators", {
    get: function() { return this._showIndicators; },
    set: function(value) { this._showIndicators = value === true ? true : false; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "indicatorSize", {
    get: function() { return this._indicatorSize; },
    set: function(value) { this._indicatorSize = parseFloat(value); },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "indicatorPosition", {
    get: function() { return this._indicatorPosition; },
    set: function(value) { this._indicatorPosition = value; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "indicatorHorizontalAlignment", {
    get: function() { return this._indicatorHorizontalAlignment; },
    set: function(value) { this._indicatorHorizontalAlignment = value; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "indicatorVerticalAlignment", {
    get: function() { return this._indicatorVerticalAlignment; },
    set: function(value) { this._indicatorVerticalAlignment = value; },
    enumerable: true, configurable: true
  });

  Object.defineProperty(NASlider.prototype, "indicatorColor", {
    get: function() { return this._indicatorColor; },
    set: function(value) { this._indicatorColor = value; },
    enumerable: true, configurable: true
  });

  Object.defineProperty(NASlider.prototype, "indicatorColorActive", {
    get: function() { return this._indicatorColorActive; },
    set: function(value) { this._indicatorColorActive = value || null; },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "indicatorBorderWidth", {
    get: function() { return this._indicatorBorderWidth; },
    set: function(value) { this._indicatorBorderWidth = parseFloat(value); },
    enumerable: true, configurable: true
  });
  
  Object.defineProperty(NASlider.prototype, "indicatorBorderColor", {
    get: function() { return this._indicatorBorderColor; },
    set: function(value) { this._indicatorBorderColor = value || null; },
    enumerable: true, configurable: true
  });

  NASlider.prototype.onLoaded = function() {
    _super.prototype.onLoaded.call(this);

    if(!this._initialized) {
      const repeater = this._getRepeater();
      const hasRepeater = this._hasRepeater = !!repeater;
      const scrollView = this._scrollView;

      scrollView.orientation = this.orientation;
      scrollView.on("scroll", e => this._onScrollEvent(e));
      scrollView.ios.showsHorizontalScrollIndicator = false;
      scrollView.ios.showsVerticalScrollIndicator = false;
      scrollView.ios.pagingEnabled = true;
      scrollView.ios.bounces = this.bounces;

      if(hasRepeater) {
        this._slidesContainer = repeater.itemsLayout;
        repeater.parent.removeChild(repeater);
        scrollView.content = repeater;
      } else {
        const slidesContainer = this._slidesContainer = this.getChildAt(1);
        slidesContainer.parent.removeChild(slidesContainer);
        scrollView.content = slidesContainer;
      }

      const slidesContainer = this._slidesContainer;
      slidesContainer.orientation = this.orientation;
      slidesContainer.eachChildView(slide => this._slides.push(slide));

      // Configure indicators container
      const indicatorsContainer = this._indicatorsContainer;
      indicatorsContainer.visibility = this.showIndicators ? "visible" : "collapsed";
      indicatorsContainer.isUserInteractionEnabled = false;
      indicatorsContainer.margin = 4;
      indicatorsContainer.orientation = (position => {
        if(position === "top" || position === "bottom") return "horizontal";
          else return "vertical";
      })(this.indicatorPosition);
      indicatorsContainer.horizontalAlignment = (position => {
        if(this.indicatorHorizontalAlignment) return this.indicatorHorizontalAlignment;
        if(position === "left") return "left";
          else if(position === "right") return "right";
          else return "center";
      })(this.indicatorPosition);
      indicatorsContainer.verticalAlignment = (position => {
        if(this.indicatorVerticalAlignment) return this.indicatorVerticalAlignment;
        if(position === "top") return "top";
          else if(position === "bottom") return "bottom";
          else return "center";
      })(this.indicatorPosition);
      this.addChild(indicatorsContainer);

      this._initialized = true;
    }
  };

  NASlider.prototype.insertSlide = function(view, props = {}) {
    const defaults = {
      atIndex: this.slidesCount,
      indicatorColor: null,
      indicatorColorActive: null,
    };
    for(let key in defaults) if(!props.hasOwnProperty(key)) props[key] = defaults[key];

    return new Promise((resolve, reject) => {
      // Create and insert slider view
      const slide = new NASliderModule.NASliderSlide();
      slide.addChild(view);
      if(props.indicatorColor) slide.indicatorColor = props.indicatorColor;
      if(props.indicatorColorActive) slide.indicatorColorActive = props.indicatorColorActive;
      this._slidePositions[props.atIndex] = slide.width * props.atIndex;
      this._slides.splice(props.atIndex, 0, slide);
      this._slidesContainer.insertChild(slide, props.atIndex);

      // Create indicator view
      const indicatorView = this._createIndicatorForView(slide);
      this._indicatorsContainer.insertChild(indicatorView, props.atIndex);

      this._refreshSlidesLayout();
      this._refreshIndicatorsState();

      resolve(slide);
    });
  };

  NASlider.prototype.scrollToSlideAt = function(index, animated = false) {
    const slidePosition = this._slidePositions[index];

    if(this.orientation === "horizontal") {
      this._scrollView.scrollToHorizontalOffset(slidePosition, animated);
    } else {
      this._scrollView.scrollToVerticalOffset(slidePosition, animated);
    }
  };

  NASlider.prototype.removeSlide = function(slide) {
    const slideIndex = this._slides.indexOf(slide);

    return new Promise((resolve, reject) => {
      if(this._hasRepeater) {
        const errorMessage = new Error("Slider instance is maintained by a Repeater. Use the items array instead.");
        console.error(errorMessage);
        reject(errorMessage);
        return;
      } else if(slide.typeName !== "NASliderSlide") {
        const errorMessage = new Error("Slide must be of type NASliderSlide");
        console.error(errorMessage);
        reject(errorMessage);
        return;
      } else if(slideIndex < 0) {
        const errorMessage = new Error("Slide does not exist inside NASlider instance");
        console.error(errorMessage);
        reject(errorMessage);
        return;
      }

      const indicatorView = this._indicatorsContainer.getChildAt(slideIndex);
      
      this._slides.splice(slideIndex, 1);
      this._slidesContainer.removeChild(slide);
      this._indicatorsContainer.removeChild(indicatorView);
      this._refreshIndicatorsState();

      this.resolve(true);
    });
  };

  NASlider.prototype.removeSlideAt = function(index) {
    return new Promise((resolve, reject) => {
      this.removeSlide(this.getSlideAt(index)).then(() => resolve(true));
    });
  };

  NASlider.prototype.removeSlides = function() {
    return new Promise((resolve, reject) => {
      if(!this._hasRepeater) {
        const removePromises = [];
        
        while(this._slides.length > 0) {
          const slide = this._slides[0];
          removePromises.push(this.removeSlide(slide));
        }

        Promise.all(removePromises).then(() => resolve(true));
      } else {
        const errorMessage = new Error("Slider instance is maintained by a Repeater. Use the items array instead.");
        console.error(errorMessage);
        reject(errorMessage);
      }
    });
  };

  NASlider.prototype.getSlideAt = function(index) {
    return this._slides[index] || null;
  };

  NASlider.prototype._createIndicatorForSlide = function(slide) {
    const indicatorView = new NASliderModule.NASliderIndicator();

    indicatorView.width = indicatorView.height = this.indicatorSize;
    indicatorView.borderWidth = this.indicatorBorderWidth;
    indicatorView.borderColor = this.indicatorBorderColor;
    indicatorView.borderRadius = indicatorView.width / 2;
    indicatorView.setColor(slide.indicatorColor, slide.indicatorColorActive);
    
    return indicatorView;
  };

  NASlider.prototype._refreshIndicatorsState = function(animated = false) {
    const currentSlideIndex = this._currentSlideIndex;
    const indicatorsContainer = this._indicatorsContainer;
    
    indicatorsContainer.removeChildren();
    this._slidePositions.length = 0;
    this._slides.forEach((slide, index) => {
      const indicatorView = indicatorsContainer.getChildAt(index) || this._createIndicatorForSlide(slide);

      if(!indicatorView.parent) indicatorsContainer.addChild(indicatorView);
      indicatorView.setActive(index === currentSlideIndex, animated);
      this._slidePositions[index] = slide.width * index;
    });

    indicatorsContainer.visibility = !this.showIndicators || this._slides.length === 1 && !this.forceFirstIndicatorVisibility ? "collapsed" : "visible";
  };
  
  NASlider.prototype._onScrollEvent = function(e) {
    const scrollPosition = this.orientation === "horizontal" ? e.scrollX : e.scrollY;
    const currentSlide = this._slides[this._slidePositions.indexOf(scrollPosition)] || null;

    this._scrollPosition = scrollPosition;
    this.notify({ eventName: "slide", object: this, scrollPosition: scrollPosition });

    if(currentSlide && currentSlide !== this.currentSlide) {
      this._currentSlideIndex = this._slides.indexOf(currentSlide);
      this._refreshIndicatorsState(true);
      this.notify({ eventName: "slideChange", object: this, slide: currentSlide });
    }
  };

  NASlider.prototype._init = function() {
    const scrollView = this._scrollView;
    scrollView.width = scrollView.height = "100%";
    this.addChild(scrollView);
  };

  NASlider.prototype._getRepeater = function() {
    const repeater = this.getChildAt(1).typeName === "Repeater" ? this.getChildAt(1) : this._scrollView.content;
    return repeater || null;
  };

  return NASlider;
})(gridLayoutModule.GridLayout);

// SLIDER CONTAINER
NASliderModule.NASliderContainer = (function(_super) {
  __extends(NASliderContainer, _super);
  function NASliderContainer() {
    const _this = _super !== null && _super.apply(this, arguments) || this;
    
    return _this;
  }

  // NASliderContainer.prototype.onLoaded = function() {
  //   _super.prototype.onLoaded.call(this);
  // };

  NASliderContainer.prototype.onLayout = function(left, top, right, bottom) {
    _super.prototype.onLayout.call(this, left, top, right, bottom);
    const slider = this._getSlider();
    const scrollView = slider.getChildAt(0);

    if(slider._initialized) {
      setTimeout(() => {
        slider._slides.length = 0;
        slider._slidesContainer.eachChildView(slide => {
          slider._slides.push(slide);
          slide._refreshLayout();
        });
        slider._refreshIndicatorsState();
      });
    }
  };

  NASliderContainer.prototype._getSlider = function() {
    let slider = this.parent;
    while(slider.typeName !== "NASlider") slider = slider.parent;
    return slider;
  };

  return NASliderContainer;
})(StackLayout);

// SLIDER INDICATOR
NASliderModule.NASliderIndicator = (function(_super) {
  __extends(NASliderIndicator, _super);
  function NASliderIndicator() {
    const _this = _super !== null && _super.apply(this, arguments) || this;
    
    _this.opacity = 0.5;

    _this._isActive = false;
    _this._inactiveView = new StackLayout();
    _this._activeView = new StackLayout();
    
    _this._init();

    return _this;
  }
  
  NASliderIndicator.prototype._init = function() {
    this.margin = 4;
    
    const inactiveView = this._inactiveView;
    inactiveView.width = inactiveView.height = "100%";
    this.addChild(inactiveView);

    const activeView = this._activeView;
    activeView.width = activeView.height = inactiveView.width;
    activeView.opacity = 0;
    this.addChild(activeView);
  };

  NASliderIndicator.prototype.setActive = function(value, animated = false) {
    const isActive = this._isActive = value === true ? true : false;
    const duration = 200;
    const curve = "easeInOut";
    
    if(animated) {
      this.animate({ opacity: isActive ? 1 : 0.5, duration: duration, curve: curve });
      if(this._inactiveView.backgroundColor !== this._activeView.backgroundColor) {
        this._inactiveView.animate({ opacity: isActive ? 0 : 1, duration: duration, curve: curve });
        this._activeView.animate({ opacity: isActive ? 1 : 0, duration: duration, curve: curve });
      }
    } else {
      this.opacity = isActive ? 1 : 0.5;
      this._inactiveView.opacity = isActive ? 0 : 1;
      this._activeView.opacity = isActive ? 1 : 0;
    }
  };

  NASliderIndicator.prototype.setColor = function(inactiveColor, activeColor) {
    if(inactiveColor) this._inactiveView.backgroundColor = inactiveColor;
    if(activeColor) this._activeView.backgroundColor = activeColor;
  };
  
  return NASliderIndicator;
})(gridLayoutModule.GridLayout);

// SLIDER VIEW
NASliderModule.NASliderSlide = (function(_super) {
  __extends(NASliderSlide, _super);
  function NASliderSlide() {
    const _this = _super !== null && _super.apply(this, arguments) || this;
    
    _this._indicatorColor = null;
    _this._indicatorColorActive = null;

    return _this;
  }

  Object.defineProperty(NASliderSlide.prototype, "indicatorColor", {
    get: function() { return this._indicatorColor; },
    set: function(value) { this._indicatorColor = value || this._defaultIndicatorColor; },
    enumerable: true, configurable: true
  });

  Object.defineProperty(NASliderSlide.prototype, "indicatorColorActive", {
    get: function() { return this._indicatorColorActive; },
    set: function(value) { this._indicatorColorActive = value || null; },
    enumerable: true, configurable: true
  });
  
  NASliderSlide.prototype.onLoaded = function() {
    _super.prototype.onLoaded.call(this);
    const slider = this._getSlider();

    this._refreshLayout();

    if(!this.indicatorColor || typeof this.indicatorColor !== "string") {
      this.indicatorColor = slider.indicatorColor;
    }
    if(!this.indicatorColorActive || typeof this.indicatorColorActive !== "string") {
      this.indicatorColorActive = slider.indicatorColorActive || this.indicatorColor;
    }
  };

  NASliderSlide.prototype.onLayout = function(left, top, right, bottom) {
    _super.prototype.onLayout.call(this, left, top, right, bottom);

    setTimeout(() => this._refreshLayout());
  };

  NASliderSlide.prototype._getSlider = function() {
    let slider = this.parent.parent;
    while(slider.typeName !== "NASlider") slider = slider.parent;
    return slider;
  };

  NASliderSlide.prototype._refreshLayout = function() {
    const slider = this._getSlider();
    const scrollView = slider.getChildAt(0);
    const prefferedWidth = scrollView.getMeasuredWidth();
    const prefferedHeight = scrollView.getMeasuredHeight();

    if(this.width !== prefferedWidth || this.height !== prefferedHeight) {
      this.width = getDIPs(prefferedWidth);
      this.height = getDIPs(prefferedHeight);
    }
  };
  
  return NASliderSlide;
})(gridLayoutModule.GridLayout);

module.exports = NASliderModule;


// INTERNAL FUNCTIONS
function getDIPs(value) {
  return utils.layout.toDeviceIndependentPixels(value);
}