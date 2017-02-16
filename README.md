# color-correction-server
A simple nodejs express proxy server. Used to request a remote image with modified RGB channels.

## GET params
```javascript
{
	url: the url of the target image
	red: modifier value for red channel
	green: modifier value for green channel
	blue: modifier value for blue channel
}
```

## Example
We can query a true color image, and modify RGB channels so we see more detail in the GB channels - i.e. ocean colors.

Before:
![Screenshot](/screenshots/original.jpeg?raw=true)

After: 
![Screenshot](/screenshots/example.jpeg?raw=true)