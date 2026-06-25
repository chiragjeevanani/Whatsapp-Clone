const http = require('http');
const fs = require('fs');

// Fetch the HTML of the login page
http.get('http://localhost:3000/login', (res) => {
  let html = '';
  res.on('data', (chunk) => { html += chunk; });
  res.on('end', () => {
    fs.writeFileSync('scratch/login_compiled.html', html);
    console.log('Successfully wrote login_compiled.html');

    // Search for stylesheets
    const regex = /<link[^>]*href="([^"]*\.css)"/g;
    let match;
    const stylesheets = [];
    while ((match = regex.exec(html)) !== null) {
      stylesheets.push(match[1]);
    }

    console.log('Found stylesheets:', stylesheets);

    if (stylesheets.length > 0) {
      // Fetch the first stylesheet
      const cssUrl = stylesheets[0].startsWith('http') ? stylesheets[0] : `http://localhost:3000${stylesheets[0]}`;
      http.get(cssUrl, (cssRes) => {
        let css = '';
        cssRes.on('data', (chunk) => { css += chunk; });
        cssRes.on('end', () => {
          fs.writeFileSync('scratch/compiled.css', css);
          console.log('Successfully wrote compiled.css. Checking for .w-full and other classes...');
          console.log('Has .w-full:', css.includes('.w-full') || css.includes('\\:w-full') || css.includes('w-full'));
          console.log('Has .flex:', css.includes('.flex') || css.includes('\\:flex') || css.includes('flex'));
          console.log('Has .max-w-md:', css.includes('.max-w-md') || css.includes('\\:max-w-md') || css.includes('max-w-md'));
        });
      });
    } else {
      // Maybe CSS is in style tags?
      console.log('No external stylesheets found. Checking for inline style tags...');
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
      let styleMatch;
      let inlineCss = '';
      while ((styleMatch = styleRegex.exec(html)) !== null) {
        inlineCss += styleMatch[1];
      }
      fs.writeFileSync('scratch/inline.css', inlineCss);
      console.log('Wrote inline.css. Has w-full:', inlineCss.includes('w-full'));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching page:', err.message);
});
