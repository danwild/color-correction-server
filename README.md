# color-correction-server
A simple nodejs express proxy server. Used to request a remote image with modified RGB channels.

## GET params
```javascript
{
	url: 'http://example.com/cat.jpeg' // the url of the target image
	r_min: 4, // min valid value for red channel
	r_max: 70, // max valid value for red channel
	g_min: 4, // min valid value for green channel
    g_max: 40, // max valid value for green channel
    b_min: 4, // min valid value for blue channel
    b_max: 40, // max valid value for blue channel
}
```

RGB params define the valid range for each channel, valid color values are then 'stretched' out to cover the 0-255 channel. 

## Example
For example, we can query a true color satellite image from NASA and modify RGB channels so we see more detail in the green/blue channels - i.e. ocean colors.

|Before|After|
|---|---|
|![Screenshot](/screenshots/original.jpeg?raw=true)|![Screenshot](/screenshots/example.jpeg?raw=true)|