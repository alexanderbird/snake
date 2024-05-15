# Snake

[snake.alexanderbird.software](http://snake.alexanderbird.software/)

A vanilla JavaScript snake game.

![screenshot of boxy snake game](./screenshot.jpg)

I started this on an airplane without internet, and I challenged myself to build
a minimalist snake game without frameworks or documentation. All I had was the
sample code that was already on my laptop.

Now that I'm connected to the internet again, I'm sticking to the following
constraints:
- no build step
- no libraries

## From the first attempt

It's been an interesting exercise to figure out what I miss most about modern
tooling. Here are the things I miss most:

1. Splitting my code into separate files
    - it's much easier to navigate between files than to scroll up and down in a
      file.
2. Unit tests
    - when I restructure the code, I feel worried that something is broken. I
      don't have this stress when I'm TDDing my code.
3. Types
    - A type-checking build step gives me more confidence that everything is wired
      up correctly.
4. Abstracting away the rendering process
    - it's not too bad to set and update HTML directly, but it does make me
      appreciate how I don't have to think about that low level detail when I'm
      using a UI framework.

## From the second attempt

I'm rewriting with the same constraints, but this time using separate files and
unit tests (my top missed items). I've built hand-rolled import and unit test
tools so I can use multiple files in the HTML and also import them in a unit
test context.

I can't think of any real project where this is a sensible approach, but as a
learning exercise I'm finding it valuable.

### Running unit tests

```
./runTests.js
```
