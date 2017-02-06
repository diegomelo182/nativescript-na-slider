// MODULES
var gridLayoutModule = require("ui/layouts/grid-layout");
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
var ScrollView = require("ui/scroll-view").ScrollView;


var NASliderModule = {};

// SLIDER
NASliderModule.NASlider = (function(_super) {
  __extends(NASlider, _super);
  function NASlider() {
    _super.call(this);
    
    this._initialized = false;
    this._hasRepeater = null;
    this._repeaterItems = null;
    this._currentSlideIndex = 0;
    this._scrollView = new ScrollView();
    this._slidesContainer = new StackLayout();
    this._slides = [];
    this._slidePositions = [];
    this._scrollPosition = 0;
    this._orientation = "horizontal";
    this._bounce = false;
    this._forceFirstIndicatorVisibility = false;
    this._showIndicators = true;
    this._indicatorsContainer = new StackLayout();
    this._indicatorSize = 8;
    this._indicatorPosition = "bottom";
    this._indicatorHorizontalAlignment = null;
    this._indicatorVerticalAlignment = null;
    this._indicatorBorderWidth = 0;
    this._indicatorBorderColor = "#404040";
  }
  
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
    var _this = this;
    
    if(!_this._initialized) _this._init();
  };

  NASlider.prototype.onLayout = function(left, top, right, bottom) {
    _super.prototype.onLayout.call(this, left, top, right, bottom);
    var _this = this;

    if(_this._initialized) {
      setTimeout(function() {
        _this._refreshSlidesLayout();
        _this._refreshIndicatorsState();
      }, 0);
    }
  };

  NASlider.prototype.insertSlide = function(view, props = {}) {
    var _this = this;
    var defaults = {
      atIndex: _this.slidesCount,
      indicatorColor: null,
      indicatorColorActive: null,
    };
    for(var key in defaults) if(!props.hasOwnProperty(key)) props[key] = defaults[key];

    return new Promise(function(resolve, reject) {
      // Create and insert slider view
      var slider = new NASliderModule.NASliderSlide();
      slider.addChild(view);
      if(props.indicatorColor) slider.indicatorColor = props.indicatorColor;
      if(props.indicatorColorActive) slider.indicatorColorActive = props.indicatorColorActive;
      _this._slidePositions[props.atIndex] = slider.width * props.atIndex;
      _this._slides.splice(props.atIndex, 0, slider);
      _this._slidesContainer.insertChild(slider, props.atIndex);

      // Create indicator view
      var indicatorView = _this._createIndicatorForView(slider);
      _this._indicatorsContainer.insertChild(indicatorView, props.atIndex);

      _this._refreshSlidesLayout();
      _this._refreshIndicatorsState();

      resolve(slider);
    });
  };

  NASlider.prototype.scrollToSlideAt = function(index, animated = false) {
    var _this = this;
    var slidePosition = _this._slidePositions[index];

    if(_this.orientation === "horizontal") _this._scrollView.scrollToHorizontalOffset(slidePosition, animated);
      else _this._scrollView.scrollToVerticalOffset(slidePosition, animated);
  };

  NASlider.prototype.removeSlide = function(slide) {
    var _this = this;
    var slideIndex = _this._slides.indexOf(slide);

    return new Promise(function(resolve, reject) {
      if(_this._hasRepeater) {
        let errorMessage = new Error("Slider instance is maintained by a Repeater. Use the items array instead.");
        console.error(errorMessage);
        reject(errorMessage);
      } else if(slide.typeName !== "NASliderSlide") {
        let errorMessage = new Error("Slide must be of type NASliderSlide");
        console.error(errorMessage);
        reject(errorMessage);
      } else if(slideIndex < 0) {
        let errorMessage = new Error("Slide does not exist inside NASlider instance");
        console.error(errorMessage);
        reject(errorMessage);
      }

      let indicatorView = _this._indicatorsContainer.getChildAt(slideIndex);
      
      _this._slides.splice(slideIndex, 1);
      _this._slidesContainer.removeChild(slide);
      _this._indicatorsContainer.removeChild(indicatorView);
      _this._refreshIndicatorsState();

      _this.resolve(true);
    });
  };

  NASlider.prototype.removeSlideAt = function(index) {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.removeSlide(_this.getSlideAt(index)).then(function() {
        resolve(true);
      });
    });
  };

  NASlider.prototype.removeAllSlides = function() {
    var _this = this;

    return new Promise(function(resolve, reject) {
      if(!_this._hasRepeater) {
        let removePromises = [];
        
        while(_this._slides.length > 0) {
          let slide = _this._slides[0];
          removePromises.push(_this.removeSlide(slide));
        }

        Promise.all(removePromises).then(function() {
          resolve(true);
        });
      } else {
        let errorMessage = new Error("Slider instance is maintained by a Repeater. Use the items array instead.");
        console.error(errorMessage);
        reject(errorMessage);
      }
    });
  };

  NASlider.prototype.getSlideAt = function(index) {
    return this._slides[index] || null;
  };

  NASlider.prototype._init = function() {
    var _this = this;

    _this._constructViews().then(function() {
      _this._initialized = true;
    });
  };

  NASlider.prototype._constructViews = function() {
    var _this = this;
    var hasRepeater = _this._hasRepeater = _this.parent.typeName === "Repeater" ? true : false;

    return new Promise(function(resolve, reject) {
      if(hasRepeater) {
        _this._repeaterItems = _this.parent.items;
        _this._repeaterItems.on("change", function(e) { _this._onRepeaterChangeEvent(e); });
      }

      // Configure scroll view
      var scrollView = _this._scrollView;
      var viewsContainer = _this._slidesContainer;
      scrollView.orientation = viewsContainer.orientation = _this.orientation;
      scrollView.content = _this._slidesContainer;
      scrollView.on("scroll", function(e) { _this._onScrollEvent(e) });
      scrollView.ios.showsHorizontalScrollIndicator = false;
      scrollView.ios.showsVerticalScrollIndicator = false;
      scrollView.ios.pagingEnabled = true;
      scrollView.ios.bounces = _this.bounces;
      if(!scrollView.parent) _this.addChild(scrollView);

      // Configure indicators container
      var indicatorsContainer = _this._indicatorsContainer;
      indicatorsContainer.removeChildren();
      indicatorsContainer.visibility = _this.showIndicators ? "visible" : "collapsed";
      indicatorsContainer.isUserInteractionEnabled = false;
      indicatorsContainer.padding = 4;
      indicatorsContainer.orientation = (function(position) {
        if(position === "top" || position === "bottom") return "horizontal";
          else return "vertical";
      })(_this.indicatorPosition);
      indicatorsContainer.horizontalAlignment = (function(position) {
        if(_this.indicatorHorizontalAlignment) return _this.indicatorHorizontalAlignment;
        if(position === "left") return "left";
          else if(position === "right") return "right";
          else return "center";
      })(_this.indicatorPosition);
      indicatorsContainer.verticalAlignment = (function(position) {
        if(_this.indicatorVerticalAlignment) return _this.indicatorVerticalAlignment;
        if(position === "top") return "top";
          else if(position === "bottom") return "bottom";
          else return "center";
      })(_this.indicatorPosition);
      if(!indicatorsContainer.parent) _this.addChild(indicatorsContainer);

      _this._slides.length = 0;
      _this._slidesContainer.removeChildren();
      while(_this.getChildrenCount() > 2) {
        let view = _this.getChildAt(0);

        view.parent.removeChild(view);
        if(view.typeName === "NASliderSlide") {
          _this._slides.push(view);
          _this._slidesContainer.addChild(view);
        }
      }

      _this._slides.forEach(function(slide, index) {
        let indicatorView = _this._createIndicatorForView(slide);
        indicatorsContainer.addChild(indicatorView);
      });

      _this._refreshSlidesLayout();
      _this._refreshIndicatorsState();

      resolve(true);
    });
  };

  NASlider.prototype._createIndicatorForView = function(view) {
    var _this = this;
    var indicatorView = new NASliderModule.NASliderIndicator();

    indicatorView.width = indicatorView.height = _this.indicatorSize;
    indicatorView.borderWidth = _this.indicatorBorderWidth;
    indicatorView.borderColor = _this.indicatorBorderColor;
    indicatorView.borderRadius = indicatorView.width / 2;
    indicatorView.setColor(view.indicatorColor, view.indicatorColorActive);
    
    return indicatorView;
  };

  NASlider.prototype._onRepeaterChangeEvent = function(e) {
    var _this = this;

    setTimeout(function() {
      _this._constructViews().then(function() {
        _this._refreshSlidesLayout();
      });
    }, 0);
  };

  NASlider.prototype._onScrollEvent = function(e) {
    var _this = this;
    var scrollPosition = _this.orientation === "horizontal" ? e.scrollX : e.scrollY;
    var currentSlide = _this._slides[_this._slidePositions.indexOf(scrollPosition)] || null;

    _this._scrollPosition = scrollPosition;
    _this.notify({ eventName: "slide", object: _this, scrollPosition: scrollPosition });

    if(currentSlide && currentSlide !== _this.currentSlide) {
      _this._currentSlideIndex = _this._slides.indexOf(currentSlide);
      _this._refreshIndicatorsState(true);
      _this.notify({ eventName: "slideChange", object: _this, slide: currentSlide });
    }
  };

  NASlider.prototype._refreshSlidesLayout = function() {
    var _this = this;

    _this._slides.forEach(function(slide, index) {
      slide.width = _this.getMeasuredWidth() - (_this.borderWidth * 2);
      slide.height = _this.getMeasuredHeight() - (_this.borderWidth * 2);
    });
  };

  NASlider.prototype._refreshIndicatorsState = function(animated = false) {
    var _this = this;
    var currentSlideIndex = _this._currentSlideIndex;

    _this._slidePositions.length = 0;
    _this._slides.forEach(function(slide, index) {
      let indicatorView = _this._indicatorsContainer.getChildAt(index);
      indicatorView.setActive(index === currentSlideIndex, animated);
      _this._slidePositions[index] = slide.width * index;
    });

    _this._indicatorsContainer.visibility = !_this.showIndicators || _this._slides.length === 1 && !_this.forceFirstIndicatorVisibility ? "collapsed" : "visible";
  };

  return NASlider;
})(gridLayoutModule.GridLayout);

// SLIDER INDICATOR
NASliderModule.NASliderIndicator = (function(_super) {
  __extends(NASliderIndicator, _super);
  function NASliderIndicator() {
    _super.call(this);
    
    this.opacity = 0.5;

    this._isActive = false;
    this._inactiveView = new StackLayout();
    this._activeView = new StackLayout();
    
    this._init();
  }
  
  NASliderIndicator.prototype._init = function() {
    var _this = this;
    
    _this.margin = 4;
    
    var inactiveView = this._inactiveView;
    inactiveView.width = inactiveView.height = "100%";
    _this.addChild(inactiveView);

    var activeView = this._activeView;
    activeView.width = activeView.height = inactiveView.width;
    activeView.opacity = 0;
    _this.addChild(activeView);
  };

  NASliderIndicator.prototype.setActive = function(value, animated = false) {
    var _this = this;
    var isActive = _this._isActive = value === true ? true : false;
    var duration = 200;
    var curve = "easeInOut";
    
    if(animated) {
      _this.animate({ opacity: isActive ? 1 : 0.5, duration: duration, curve: curve });
      if(_this._inactiveView.backgroundColor !== _this._activeView.backgroundColor) {
        _this._inactiveView.animate({ opacity: isActive ? 0 : 1, duration: duration, curve: curve });
        _this._activeView.animate({ opacity: isActive ? 1 : 0, duration: duration, curve: curve });
      }
    } else {
      _this.opacity = isActive ? 1 : 0.5;
      _this._inactiveView.opacity = isActive ? 0 : 1;
      _this._activeView.opacity = isActive ? 1 : 0;
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
    _super.call(this);
    
    this._indicatorColor = null;
    this._indicatorColorActive = null;
    this._defaultIndicatorColor = "#808080";
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
    var _this = this;
    
    if(typeof _this.indicatorColor !== "string") _this.indicatorColor = _this._defaultIndicatorColor;
    if(!_this.indicatorColorActive || typeof _this.indicatorColorActive !== "string") _this.indicatorColorActive = _this._indicatorColor;
  };
  
  return NASliderSlide;
})(gridLayoutModule.GridLayout);

module.exports = NASliderModule;