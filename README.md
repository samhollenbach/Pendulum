# Pendulum Visualizer

Based on the [Pendulum Wave effect](https://www.youtube.com/watch?v=yVkdfJ9PkRQ), this simple yet mezmerizing visualizer fits nearly any music.

## The Math

The visualization effect is based on this simple function:

```
function getY(i, t){
		return  height/2 *  (1 + Math.sin((t * (i/400 + 0.02)) % 2*Math.PI));
}
```
This function returns the current Y coordinate of the ball at index `i` at time `t`, scaled to fit height `height`. The constants can be adjusted to change the speed and behavior.


## Technical Details

HTML / CSS

JQuery / Javascript

