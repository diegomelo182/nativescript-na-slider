# NativeScript NA Slider plugin

**NOTE! Android is currently not supported.**

A NativeScript slider. The successor of my previous, deprecated slideshow plugin, [nativescript-na-slideshow](https://github.com/NordlingArt/nativescript-na-slideshow).

## Installation

`$ tns plugin add nativescript-na-slider`

## Usage

Slides can be added statically inside the XML as below:

```xml
<Page xmlns:NASlider="nativescript-na-slider">
  
  <NASlider:NASlider id="slider">
    <NASlider:NASliderContainer>
      <NASlider:NASliderSlide>
        <Label text="Slide 1" />
      </NASlider:NASliderSlide>
      <NASlider:NASliderSlide>
        <Label text="Slide 2" />
      </NASlider:NASliderSlide>
      <NASlider:NASliderSlide>
        <Label text="Slide 3" />
      </NASlider:NASliderSlide>
    </NASlider:NASliderContainer>
  </NASlider:NASlider>
  
</Page>
```

#### Using `<Repeater>`

For a more dynamic slider, a `<Repeater>` can be used:

```xml
<Page xmlns:NASlider="nativescript-na-slider">
  
  <NASlider:NASlider items="{{ slides }}">
    <Repeater>
      <Repeater.itemsLayout>
        <NASlider:NASliderContainer />
      </Repeater.itemsLayout>
      <Repeater.itemTemplate>
        <NASlider:NASliderSlide>
          <Label text="{{ text }}" />
        </NASlider:NASliderSlide>
      </Repeater.itemTemplate>
    </Repeater>
  </NASlider:NASlider>
  
</Page>
```

This way, a slider can simply be set up with an `ObservableArray`. The `<NASliderContainer>` will act as the Repeater's `itemsLayout`, while a `<NASliderSlide>` becomes the wrapper `itemTemplate` of the Repeater.

### Properties

#### `<NASlider>`

| Property                        | Type                                | Description                              |
| :------------------------------ | :---------------------------------- | :--------------------------------------- |
| `bounce`                        | Boolean *(default: false)*          | Gets or sets scroll bouncing effect.     |
| `currentSlide`                  | View`<NASliderSlide>` *(read-only)* | Gets the current slide view.             |
| `currentSlideIndex`             | Integer *(read-only)*               | Gets the current slide index.            |
| `forceFirstIndicatorVisibility` | Boolean *(default: false)*          | Gets or sets the visibility of the first indicator if there is only one slide available. |
| `showIndicators`                | Boolean *(default: true)*           | Gets or sets the indicators' visibility. |
| `indicatorBorderColor`          | String *(default: "#404040")*       | Gets or sets indicators' border color.   |
| `indicatorBorderWidth`          | Float *(default: 0)*                | Gets or sets indicators' border width.   |
| `indicatorColor`                | String *(default: "808080")*        | Gets or sets the indicator color for all slides. |
| `indicatorColorActive`          | String *(default: null)*            | Gets or sets the indicator color for all slides when active (current visible slide). |
| `indicatorHorizontalAlignment`  | String *(default: null)*            | Gets or sets indicators' horizontal alignment. Overrides `indicatorPosition` property. |
| `indicatorPosition`             | String *(default: "bottom")*        | Gets or sets indicators' position.       |
| `indicatorSize`                 | Float *(default: 8)*                | Gets or sets indicators' size.           |
| `indicatorVerticalAlignment`    | String *(default: null)*            | Gets or sets indicators' vertical alignment. Overrides `indicatorPosition` property. |
| `items`                         | Array *(default: undefined)*        | Gets or sets the items array for a `<Repeater>`. |
| `orientation`                   | String (*default: "horizontal")*    | Gets or sets the slider orientation. Can be either "horizontal" or "vertical". |
| `scrollPosition`                | Float *(read-only)*                 | Gets the current scroll position.        |
| `slidesCount`                   | Integer *(read-only)*               | Gets the total amount of slides.         |

#### `<NASliderSlide>`

| Property               | Type                     | Description                              |
| :--------------------- | :----------------------- | :--------------------------------------- |
| `indicatorColor`       | String *(default: null)* | Gets or sets the indicator color for specific slide. |
| `indicatorColorActive` | String *(default: null)* | Gets or sets the indicator color for specific slide when active (current visible slide). |

### Methods

#### getSlideAt

`getSlideAt(index: integer): <NASliderSlide>`

Returns the slide at specified index.

| Parameter | Type    | Description                              |
| :-------- | :------ | :--------------------------------------- |
| `index`   | Integer | The index position of the slide to return. |

------

#### insertSlide

`insertSlide(view: <View>, props: object): Promise<NASliderSlide>`

Insert new slide with optional properties. Returns a *Promise* with the new slide.

| Parameter | Type                | Description                  |
| :-------- | :------------------ | :--------------------------- |
| `view`    | `<View>`            | The view to insert as slide. |
| `props`   | Object *(optional)* | Optional properties.         |

##### `props`

| Property               | Type                                    | Description                              |
| :--------------------- | :-------------------------------------- | :--------------------------------------- |
| `atIndex`              | Integer *(default: `this.slidesCount`)* | Sets the index position. If not specified, the slide will become last. |
| `indicatorColor`       | String *(default: null)*                | Sets the indicator color for specific slide. |
| `indicatorColorActive` | String *(default: null)*                | Sets the indicator color for specific slide when active (current visible slide). |

---------

#### removeSlide

`removeSlide(slide: <NASliderSlide>): Promise`

Remove the specified slide. Returns a *Promise*.

| Parameter | Type              | Description          |
| :-------- | :---------------- | :------------------- |
| `slide`   | `<NASliderSlide>` | The slide to remove. |

------

#### removeSlideAt

`removeSlideAt(index : integer): Promise`

Remove slide at specified index. Returns a *Promise*.

| Parameter | Type    | Description                              |
| :-------- | :------ | :--------------------------------------- |
| `index`   | Integer | The index position of the slide to remove. |

------

#### removeSlides

`removeSlides(): Promise`

Removes all slides. Returns a *Promise*.

*Will not work if `<NASlider>` instance is maintained by a Repeater.*

------

#### scrollToSlideAt

`scrollToSlideAt(index : integer, animated : boolean): void`

Scrolls to slide at specified index. Animated or not.

| Parameter  | Type                       | Description                    |
| :--------- | :------------------------- | :----------------------------- |
| `index`    | Integer                    | The slide to remove.           |
| `animated` | Boolean *(default: false)* | Animates the scrolling effect. |

### Events

The following events can be observed with `on()` and `addEventListener()`:

#### slide

Fired when sliding.

##### Event data

| Property         | Type   | Description                              |
| :--------------- | :----- | :--------------------------------------- |
| `eventName`      | String | Gets the name of the event.              |
| `object`         | Object | Gets the `<NASlider>` instance.          |
| `scrollPosition` | Float  | Gets the current scroll position. Will be either the horizontal or vertical position depending on orientation of the `<NASlider>` instance. |

------

#### slideChange

Fired when the `<NASlider>` instance has changed slide.

##### Event data

| Property    | Type              | Description                     |
| :---------- | :---------------- | :------------------------------ |
| `eventName` | String            | Gets the name of the event.     |
| `object`    | Object            | Gets the `<NASlider>` instance. |
| `slide`     | `<NASliderSlide>` | Gets the current visible slide. |

## Known issues

- No Android compatibility, yet.

## History

### Version 1.1.3 (February 10, 2017)

- Fixed crash when navigating within the frame's backstack.

### Version 1.1.2 (February 8, 2017)

- Stability improvements.
- Slides should now dynamically adapt to slider's dimensions.

### Version 1.1.0 (February 7, 2017)

- `removeAllSlides` method has been renamed to `removeSlides`.
- Fixed Repeater not working as expected. Check documentation for the new way to use `<NASlider>`.

### Version 1.0.2 (February 6, 2017)

- Documentation fixes.

### Version 1.0.0 (February 6, 2017)

- First release!

## Credits

- [NordlingArt](https://github.com/NordlingArt)

## License

[MIT](/LICENSE) - for {N} version 2.5.0+