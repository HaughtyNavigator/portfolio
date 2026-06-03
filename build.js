const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const indexEjsPath = path.join(viewsDir, 'index.ejs');
const docsDir = path.join(__dirname, 'docs');
const publicDir = path.join(__dirname, 'public');

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Ensure docs directory exists and is clean
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir, { recursive: true });

// 2. Copy public folder contents to docs
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, docsDir);
  console.log('Copied static assets from public/ to docs/');
}

// 3. Compile EJS template to docs/index.html
ejs.renderFile(indexEjsPath, {}, { views: [viewsDir] }, (err, html) => {
  if (err) {
    console.error('Error rendering EJS:', err);
    process.exit(1);
  }
  
  fs.writeFileSync(path.join(docsDir, 'index.html'), html);
  console.log('Successfully compiled views/index.ejs to docs/index.html!');
});
