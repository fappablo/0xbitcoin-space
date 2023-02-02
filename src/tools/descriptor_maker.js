const fs = require("fs");
const path = require("path");


function getFilesRecursively(directory, files = []) {
    const filesInDirectory = fs.readdirSync(directory);
    for (const file of filesInDirectory) {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute, files);
        } else {
            files.push(absolute);
        }
    }
    return files;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function getDescriptorForImage(imageName) {
    const fileDescriptorModel = fs.readFileSync("src/tools/descriptor_model.json", { encoding: 'utf8' });
    return replaceAll(fileDescriptorModel, "%IMAGE_NAME%", imageName);
}

function generateGraphicsDescriptor() {
    const extnames = [".png"];
    const files = getFilesRecursively("public/assets/VERSIONS/");
    for (let file of files) {
        const fileExtension = path.extname(file);
        if (extnames.includes(fileExtension)) {
            console.log("image found -> " + file);
            const descriptorFilePath = file.substring(0, file.length - fileExtension.length) + ".json";
            //console.log(descriptorFilePath);
            const imageName = path.basename(file).substring(0, path.basename(file).length - fileExtension.length);
            console.log(imageName);
            const imageDescriptor = getDescriptorForImage(imageName);
            fs.writeFileSync(descriptorFilePath, imageDescriptor);
        }
    }

}

generateGraphicsDescriptor();

