const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const sourceDir = path.join(__dirname, 'node_modules');
const targetDir = path.join(__dirname, 'src', 'main', 'webapp', 'dist', 'node_modules_package_jsons');

function copyPackageJsons(dir) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                copyPackageJsons(fullPath);
            } else if (file === 'package.json') {
                const relativePath = path.relative(sourceDir, fullPath);
                const targetPath = path.join(targetDir, relativePath);
                mkdirp.sync(path.dirname(targetPath));
                fs.copyFileSync(fullPath, targetPath);
                console.log(`Copied: ${relativePath}`);
            }
        });
    } catch (error) {
        console.error("Failed to generate npm dependencies");
        console.error(error);
    }
}

console.log("Begin package.json assembly for Xray");
copyPackageJsons(sourceDir);
console.log("Finished package.json assembly for Xray");
