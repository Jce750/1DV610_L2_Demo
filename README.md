# Demo app for Game-Board Library

## Objectives

This project aim to demonstrate the use of the Game-Board Library by presenting a tic-tac-toe-game component using the library. The game can be played in a browser.

The game is built as a javascript-component embedded in a html-page.
It is built for development environment only
It should be run on a local computer

## Github resources

### demo-app

  [https://github.com/Jce750/1DV610_L2_Demo](https://github.com/Jce750/1DV610_L2_Demo).

  The main implementation in the demo can be found in:
  /src/js/components/x-tictactoe/tictactoe.js

#### Look inside

- #createBoard ()
- #evaluateGame (currentCell)

### Library

  [https://github.com/Jce750/1DV610_L2_Demo](https://github.com/Jce750/1DV610_L2).

## Installation

### Library installation

In your library-folder, open a command prompt.
To download a copy of the library run:

```git
git clone https://github.com/Jce750/1DV610_L2
```

then to install dependencies run:

```node
npm install
```

### Demo installation

Since the library is not published on npm you can manually point to the library from the package.json of this demo (or your app using it).
Under dependencies in package.json of your app add:

```javascript
"matrixanalysislibrary": "{Your relative path to the library folder}/{Name of library folder}",
```

Lets say you have these folders:  
parentFolder/L1_MatrixAnalysisLibrary  
parentFolder/Your_project

example:

```text
"matrixanalysislibrary": "../../L1_MatrixAnalysisLibrary"
```

then to install dependencies run:

```node
npm install
```

#### Start

Alternative routes:

- Start by typing 'npm run dev' in the vsc terminal
- start by hovering src/index.html right-click and select 'open with live server'
