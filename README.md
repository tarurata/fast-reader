# FastReader Chrome Extension

FastReader is a Chrome extension that enhances reading speed by highlighting words sequentially in web page paragraphs.

![FastReader Demo](assets/fastreader-demo.gif)

## Features

- Highlights words one by one in paragraphs
- Adjustable reading speed (Words Per Minute)
- Click on any word to start reading from that point
- Works on all paragraphs in a web page

## Installation

1. Clone this repository or download the source code
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any web page
2. Click on the FastReader extension icon
3. Use the popup controls to:
   - Start/stop the reader
   - Adjust reading speed
   - Initialize paragraphs (if needed)

## How It Works

Here's a demonstration of FastReader in action:

![FastReader in Action](assets/fastreader-demo.gif)

## Developer Notes

- The main functionality is in `content.js`
- Use `window.FastReader` in the console for debugging:
  - `FastReader.start(paragraphIndex, wordIndex)`
  - `FastReader.stop()`
  - `FastReader.initialize()`
  - `FastReader.getState()`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)