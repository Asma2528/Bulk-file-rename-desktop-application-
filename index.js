const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to rename files
function renameFiles(folder, replaceThis, replaceWith, shouldRename) {
  fs.readdir(folder, (err, data) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // To read the directory
    for (let index = 0; index < data.length; index++) {
      // for loop to iterate over each file in the directory
      const item = data[index]; // A single file

      let oldFile = path.join(folder, item); // Existing filename
      let newFile = path.join(folder, item.replace(replaceThis, replaceWith)); // Changing the name of the existing file

      // Check if the file exists before renaming
      if (fs.existsSync(oldFile)) {
        // If shouldRename is true - rename the file; if false, just preview
        if (shouldRename) {
          fs.rename(oldFile, newFile, (err) => {
            if (err) {
              console.error(`Error renaming ${item}:`, err);
            } else {
              console.log(`Rename Successful: ${item} -> ${path.basename(newFile)}`);
            }
          });
        } else {
          if (oldFile !== newFile) {
            console.log(`Preview: ${oldFile} will be renamed to ${newFile}`);
          }
        }
      } else {
        console.error(`File not found: ${oldFile}`);
      }
    }
  }); // When the data is read, the asynchronous function will start running
}

// Prompt user for input
rl.question("Enter the text to replace: ", (replaceThis) => {
  rl.question("Enter the replacement text: ", (replaceWith) => {
    rl.question("Do you want to rename all the files? (yes or no): ", (answer) => {
      const shouldRename = answer.trim().toLowerCase() === 'yes';

      // Get current directory
      const folder = process.cwd();

      // Call function to rename files
      renameFiles(folder, replaceThis, replaceWith, shouldRename);

      // Close readline interface
      rl.close();
    });
  });
});
