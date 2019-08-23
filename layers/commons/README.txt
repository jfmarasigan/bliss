uninstall aws-sdk first before applying as lambda layer
reinstall aws-sdk when in development
replace region setup in custom libraries using aws-sdk

before zipping/creating zip file:
1. node_modules folder should be inside "nodejs" folder
2. other custom js files should be in the same directory as "nodejs" folder
3. do not put "nodejs" folder and custom js files inside a folder before "zipping" (zip the folder contents instead of the folder)
4. select (ctrl+click) the "nodejs" folder and custom js files, then do the zip command (right click...)
5. Place all files in the dependencies folder (custom js files and nodejs folder)