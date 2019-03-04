# dt-codeowners
Update the CODEOWNERS file from Definitely Typed

1. Clone DefinitelyTyped and dt-codeowners into sibling directories
2. Run `npm install` in dt-codeowners
3. In the dt-codeowners directory, run:
  * `node index.js`
4. This will edit the file `.github/CODEOWNERS` in the DefinitelyTyped folder
5. Commit that file and merge it with a PR on DefinitelyTyped


NOTE: This script is so simple that it is now part of Definitely Typed.
Try `npm run update-codeowners` there.
