// MODULES
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var builder = require("ui/builder");

var slider1, slider2;

var page, pageData, createPageData = function() {
  return new Observable({
    sliderItems: new ObservableArray([
      new Observable({ text: "Slide 1" }),
      new Observable({ text: "Slide 2" }),
      new Observable({ text: "Slide 3" })
    ])
  });
};

exports.navigatingTo = function(args) {
  page = args.object;
  page.bindingContext = pageData = createPageData();
  
  slider1 = page.getViewById("slider1");
  slider2 = page.getViewById("slider2");

  setTimeout(function() {
    pageData.sliderItems.push(new Observable({
      text: "Slide " + (pageData.sliderItems.length+1) +" (pushed)",
      indicatorColor: "#239790",
      indicatorColorActive: "#2493c6"
    }));
  }, 3000);
};

exports.scrollToSlide = function(args) {
  var lastSlideIndex = slider1.slidesCount-1;
  slider1.scrollToSlideAt(lastSlideIndex, true);
};

exports.insertSlide = function(args) {
  var newSlide = builder.parse(
    '<StackLayout horizontalAlignment="center" verticalAlignment="center">' + 
      '<Label text="Slide ' + (slider1.slidesCount+1) + ' (inserted)" />' +
    '</StackLayout>'
  );

  slider1.insertSlide(newSlide, {
    indicatorColor: "#239790",
    indicatorColorActive: "#2493c6"
  });
};

exports.removeSlide = function(args) {
  var slide = args.object.parent.parent;
  slider1.removeSlide(slide);
};