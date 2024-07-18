// Required modules
const fs = require("fs"); // File system module to interact with the file system
const path = require("path"); // Path module to work with file and directory paths
const readline = require("readline"); // Readline module to read input from the user

// Creating an interface to read lines from the command line
const rl = readline.createInterface({
  input: process.stdin, // Standard input (usually the keyboard)
  output: process.stdout, // Standard output (usually the screen)
});

// Function to rename files
// Parameters:
/*
folder - In which folder the files are located
replaceThis - which files are to be renamed
replaceWith - with what names the files should be renamed
shouldRename - a confirmation of whether to rename it or not (like a preview)
*/
function renameFiles(folder, replaceThis, replaceWith, shouldRename) {
  // Read the contents of the directory
  fs.readdir(folder, (err, data) => {
    if (err) {
      console.error("Error reading directory:", err); // Log any errors which occur while reading the directory
      return;
    }

    // Iterate over each file in the directory
    for (let index = 0; index < data.length; index++) {
      // data - when we read the directory, all the directory contents where stored in the data variable
      // for loop to iterate over each file in the directory
      const item = data[index]; // A single file

      let oldFile = path.join(folder, item); // Get the full path of the existing file
      let newFile = path.join(folder, item.replace(replaceThis, replaceWith)); /// Get the full path of the new file name after replacement

      // Check if the file exists before renaming
      if (fs.existsSync(oldFile)) {
        // If shouldRename is true, rename the file; if false, just preview the change (  Means if the user chooses to preview the changes (i.e., enters no when asked if they want to rename all the files), the files wont be renamed)

        if (shouldRename) {
          // Rename the file
          fs.rename(oldFile, newFile, (err) => {
            if (err) {
              console.error(`Error renaming ${item}:`, err);  // Log any errors during renaming
            } else {
              console.log(
                `Rename Successful: ${item} -> ${path.basename(newFile)}` // Log the success message
              );
            }
          });
        } else {
          // If not renaming, just show the preview message
          if (oldFile !== newFile) {
            console.log(`Preview: ${oldFile} will be renamed to ${newFile}`);
          }
        }
      } else {
        console.error(`File not found: ${oldFile}`); // Log if the file does not exist
      }
    }
  }); // When the data is read by the readdir function, the asynchronous function will start running
}

// Prompt user for input
rl.question("Enter the text to replace: ", (replaceThis) => {
/*  This prompts the user with the message "Enter the text to replace: ".
When the user enters their input and presses Enter, the input is passed to the callback function as the replaceThis parameter. */
  rl.question("Enter the replacement text: ", (replaceWith) => {
    /* This prompts the user with the message "Enter the replacement text: ".
The user's input is passed to the callback function as the replaceWith parameter.
    */
    rl.question(
      "Do you want to rename all the files? (yes or no): ",
      (answer) => {
      /* This prompts the user with the message "Do you want to rename all the files? (yes or no): ".
The user's input is passed to the callback function as the answer parameter.
*/
        const shouldRename = answer.trim().toLowerCase() === "yes"; // Convert the answer to a boolean

        // Get the current working directory
        const folder = process.cwd();

        // Call function to rename files
        renameFiles(folder, replaceThis, replaceWith, shouldRename);
          // Close readline interface after all operations are complete
          rl.close();

      });
  });
});
