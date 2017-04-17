// MODULES
const observable = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray;
const builder = require("ui/builder");

let slider1, slider2;

let page, pageData, createPageData = function() {
  return observable.fromObject({
    sliderItems: new ObservableArray([
      observable.fromObject({ text: "Slide 1" }),
      observable.fromObject({ text: "Slide 2" }),
      observable.fromObject({ text: "Slide 3" })
    ])
  });
};

exports.onNavigatingTo = function(args) {
  page = args.object;
  page.bindingContext = pageData = createPageData();
  
  slider1 = page.getViewById("slider1");
  slider2 = page.getViewById("slider2");

  setTimeout(() => {
    pageData.sliderItems.push(observable.fromObject({
      text: `Slide ${pageData.sliderItems.length+1} (pushed)`,
      indicatorColor: "#239790",
      indicatorColorActive: "#2493c6"
    }));
  }, 3000);
};

exports.scrollToSlide = function(args) {
  const lastSlideIndex = slider1.slidesCount-1;
  slider1.scrollToSlideAt(lastSlideIndex, true);
};

exports.insertSlide = function(args) {
  const newSlide = builder.parse(`
    <StackLayout horizontalAlignment="center" verticalAlignment="center"> 
      <Label text="Slide ${slider1.slidesCount+1} (inserted)" />
    </StackLayout>
  `);

  slider1.insertSlide(newSlide, {
    indicatorColor: "#239790",
    indicatorColorActive: "#2493c6"
  });
};

exports.removeSlide = function(args) {
  const slide = args.object.parent.parent;
  slider1.removeSlide(slide);
};