# color-correction-server
A simple nodejs express proxy server. Used to request a remote image with modified RGB channels.

## GET params
```javascript
{
	url: 'http://example.com/cat.jpeg' // the url of the target image
	red: 1 // modifier value for red channel
	green: 1 // modifier value for green channel
	blue: 1 // modifier value for blue channel
}
```

RGB params are applied as weights. 
i.e. `R = R * <value>`.
So a value equal to 1 does nothing: `R * 1 = R`, a value over one increases the channel, and a value below one decreases the channel. 

## Example
For example, we can query a true color satellite image from NASA and modify RGB channels so we see more detail in the green/blue channels - i.e. ocean colors.

|Before|After|
|---|---|
|![Screenshot](/screenshots/original.jpeg?raw=true)|![Screenshot](/screenshots/example.jpeg?raw=true)|